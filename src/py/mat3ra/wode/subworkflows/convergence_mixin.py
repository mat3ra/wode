from typing import Any, Dict, List, Optional, Protocol, cast

from mat3ra.esse.models.workflow.subworkflow.convergence.enum_options import ConvergenceParameterNameEnum
from mat3ra.utils.extra.jinja import JINJA_EXPRESSION_PATTERN, NUMERIC_VALUE_PATTERN, wrap_in_raw_block

from .convergence.factory import create_convergence_parameter
from ..context.providers import PointsGridDataProvider
from ..units import Unit

CONVERGENCE_PARAMETER_TAG = "hasConvergenceParam"
CONVERGENCE_RESULT_TAG = "hasConvergenceResult"
ENERGY_CONVERGENCE_RESULT = "total_energy"


class ConvergenceHost(Protocol):
    units: List[Any]

    def find_unit_with_tag(self, tag: str) -> Optional[Any]: ...

    def add_unit(self, unit: Unit, index: Optional[int] = None) -> None: ...


class ConvergenceMixin:
    @property
    def scope_variables(self) -> List[str]:
        return [parameter_name.value for parameter_name in ConvergenceParameterNameEnum]

    @property
    def scalar_results(self) -> List[str]:
        return [ENERGY_CONVERGENCE_RESULT]

    @property
    def convergence_parameter(self) -> Optional[str]:
        unit = cast(ConvergenceHost, self).find_unit_with_tag(CONVERGENCE_PARAMETER_TAG)
        return getattr(unit, "operand", None) if unit else None

    @property
    def convergence_result(self) -> Optional[str]:
        unit = cast(ConvergenceHost, self).find_unit_with_tag(CONVERGENCE_RESULT_TAG)
        return getattr(unit, "operand", None) if unit else None

    @property
    def has_convergence(self) -> bool:
        return bool(self.convergence_parameter and self.convergence_result)

    def convergence_series(self, scope_track: Optional[List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
        if not self.has_convergence or not scope_track:
            return []

        last_result = object()
        series: List[Dict[str, Any]] = []
        for scope_item in scope_track:
            global_scope = ((scope_item or {}).get("scope") or {}).get("global") or {}
            parameter = global_scope.get(self.convergence_parameter)
            result = global_scope.get(self.convergence_result)
            is_new_result = result is not None and result != last_result
            last_result = result
            if is_new_result:
                series.append({"x": len(series) + 1, "parameter": parameter, "y": result})
        return series

    def _find_unit_for_convergence(self, result: str):
        for unit in cast(ConvergenceHost, self).units:
            for item in unit.results or []:
                item_name = item.get("name") if isinstance(item, dict) else item
                if item_name == result:
                    return unit
        return None

    @staticmethod
    def _merge_convergence_context(unit_context: Dict[str, Any], convergence_context: Dict[str, Any]) -> Dict[str, Any]:
        merged_context = dict(unit_context)
        merged_kgrid_context = dict(unit_context.get("kgrid") or {})
        merged_kgrid_context.update(convergence_context.get("kgrid") or {})
        merged_context.update(convergence_context)
        if merged_kgrid_context:
            merged_context["kgrid"] = merged_kgrid_context
        return merged_context

    def _build_convergence_units(
        self,
        parameter_name: str,
        parameter_initial_value: str,
        parameter_increment_expr: str,
        parameter_final_value: str,
        parameter_input: List[Dict[str, str]],
        result_name: str,
        result_unit_flowchart_id: str,
        execution_unit_flowchart_id: str,
        result_initial: Any = 0,
        condition: Optional[str] = None,
        operator: str = "<",
        tolerance: Any = 1e-5,
        max_occurrences: int = 10,
    ) -> None:
        host = cast(ConvergenceHost, self)
        prev_result = "prev_result"
        iteration = "iteration"
        condition_expression = condition or f"abs(({prev_result}-{result_name})/{result_name})"

        param_init = Unit(
            name="init parameter",
            type="assignment",
            operand=parameter_name,
            value=parameter_initial_value,
            tags=[CONVERGENCE_PARAMETER_TAG],
        )
        prev_result_init = Unit(name="init result", type="assignment", operand=prev_result, value=result_initial)
        iter_init = Unit(name="init counter", type="assignment", operand=iteration, value=1)
        store_result = Unit(
            name="update result",
            type="assignment",
            input=[{"scope": result_unit_flowchart_id, "name": result_name}],
            operand=result_name,
            value=result_name,
            tags=[CONVERGENCE_RESULT_TAG],
        )
        store_prev_result = Unit(
            name="store result",
            type="assignment",
            input=[{"scope": result_unit_flowchart_id, "name": result_name}],
            operand=prev_result,
            value=result_name,
        )
        next_iter = Unit(name="update counter", type="assignment", operand=iteration, value=f"{iteration} + 1")
        next_step = Unit(
            name="update parameter",
            type="assignment",
            input=parameter_input,
            operand=parameter_name,
            value=parameter_increment_expr,
            next=execution_unit_flowchart_id,
        )
        exit_unit = Unit(name="exit", type="assignment", operand=parameter_name, value=parameter_final_value)
        condition_unit = Unit(
            name="check convergence",
            type="condition",
            input=[],
            statement=f"{condition_expression} {operator} {tolerance}",
            maxOccurrences=max_occurrences,
            next=store_prev_result.flowchartId,
        )
        setattr(condition_unit, "then", exit_unit.flowchartId)
        setattr(condition_unit, "else", store_prev_result.flowchartId)

        host.add_unit(param_init, index=0)
        host.add_unit(prev_result_init, index=1)
        host.add_unit(iter_init, index=2)
        host.add_unit(store_result)
        host.add_unit(condition_unit)
        host.add_unit(store_prev_result)
        host.add_unit(next_iter)
        host.add_unit(next_step)
        host.add_unit(exit_unit)

        next_step.next = execution_unit_flowchart_id

    def add_convergence(
        self,
        parameter: str,
        parameter_initial: Any,
        parameter_increment: Any,
        reciprocal_vector_ratios: Optional[List[float]] = None,
        result: str = ENERGY_CONVERGENCE_RESULT,
        result_initial: Any = 0,
        condition: Optional[str] = None,
        operator: str = "<",
        tolerance: Any = 1e-5,
        max_occurrences: int = 10,
    ) -> None:
        parameter_name = ConvergenceParameterNameEnum(parameter)

        if result != ENERGY_CONVERGENCE_RESULT:
            raise ValueError(f"Unsupported convergence result: {result}")

        unit_for_convergence = self._find_unit_for_convergence(result)
        if unit_for_convergence is None:
            raise ValueError(f"Subworkflow does not contain a unit with '{result}' as an extracted property.")

        if (
            parameter_name
            in (
                ConvergenceParameterNameEnum.N_k_nonuniform,
                ConvergenceParameterNameEnum.N_k_nonuniform_2D,
            )
            and reciprocal_vector_ratios is None
        ):
            reciprocal_vector_ratios = PointsGridDataProvider(
                context=unit_for_convergence.context
            ).get_reciprocal_vector_ratios()
            if reciprocal_vector_ratios is None:
                raise ValueError("Non-uniform k-grid convergence requires reciprocal_vector_ratios to be provided.")

        parameter = create_convergence_parameter(
            name=parameter_name.value,
            initial_value=parameter_initial,
            increment=parameter_increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )

        merged_context = self._merge_convergence_context(
            unit_for_convergence.context,
            parameter.unit_context,
        )
        unit_for_convergence.set_context(merged_context)

        self._build_convergence_units(
            parameter_name=parameter.name,
            parameter_initial_value=parameter.initial_value,
            parameter_increment_expr=parameter.increment,
            parameter_final_value=parameter.final_value,
            parameter_input=parameter.use_variables_from_unit_context(unit_for_convergence.flowchartId),
            result_name=result,
            result_unit_flowchart_id=unit_for_convergence.flowchartId,
            execution_unit_flowchart_id=unit_for_convergence.flowchartId,
            result_initial=result_initial,
            condition=condition,
            operator=operator,
            tolerance=tolerance,
            max_occurrences=max_occurrences,
        )

    def add_template_parameter_convergence(
        self,
        parameter_name: str,
        parameter_initial: Any,
        parameter_increment: Any,
        result_name: str,
        result_initial: Any = 0,
        condition: Optional[str] = None,
        operator: str = "<",
        tolerance: Any = 1e-3,
        max_occurrences: int = 10,
    ) -> None:
        """
        Add a convergence loop for an arbitrary template parameter.

        Uses regex substitution to inject the parameter as a runtime scope variable into the
        execution unit's input template, then delegates to _build_convergence_units.

        Args:
            parameter_name: Parameter name as it appears in the input template (e.g. "degauss").
            parameter_initial: Starting value of the parameter.
            parameter_increment: Scalar step added each iteration.
            result_name: Name of the result property to monitor (must exist in a unit's results).
            result_initial: Seed value for the result before the first iteration.
            condition: Optional custom convergence condition expression.
            operator: Comparison operator for the convergence condition (default "<").
            tolerance: Convergence threshold.
            max_occurrences: Maximum number of loop iterations.
        """
        host = cast(ConvergenceHost, self)
        execution_units = [u for u in host.units if u.type == "execution"]
        if not execution_units:
            raise ValueError("No execution unit found in subworkflow.")

        result_unit = self._find_unit_for_convergence(result_name)
        if result_unit is None:
            raise ValueError(f"No unit with result '{result_name}' found in subworkflow.")

        scope_reference = wrap_in_raw_block("{{ " + parameter_name + " }}")
        pattern = rf"{parameter_name}\s*=\s*(?:{NUMERIC_VALUE_PATTERN}|{JINJA_EXPRESSION_PATTERN})"
        for execution_unit in execution_units:
            execution_unit.replace_in_input_content(pattern, f"{parameter_name} = {scope_reference}")
            execution_unit.add_context({parameter_name: parameter_initial})

        self._build_convergence_units(
            parameter_name=parameter_name,
            parameter_initial_value=parameter_initial,
            parameter_increment_expr=f"{parameter_name} + {parameter_increment}",
            parameter_final_value=parameter_name,
            parameter_input=[],
            result_name=result_name,
            result_unit_flowchart_id=result_unit.flowchartId,
            execution_unit_flowchart_id=execution_units[0].flowchartId,
            result_initial=result_initial,
            condition=condition,
            operator=operator,
            tolerance=tolerance,
            max_occurrences=max_occurrences,
        )
