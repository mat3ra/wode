from typing import Any, Dict, List, Optional, Protocol, cast

from ..units import Unit
from .convergence.enums import ConvergenceParameterName
from .convergence.factory import create_convergence_parameter

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
        return [parameter_name.value for parameter_name in ConvergenceParameterName]

    @property
    def scalar_results(self) -> List[str]:
        return [ENERGY_CONVERGENCE_RESULT]

    @property
    def convergence_param(self) -> Optional[str]:
        unit = cast(ConvergenceHost, self).find_unit_with_tag(CONVERGENCE_PARAMETER_TAG)
        return getattr(unit, "operand", None) if unit else None

    @property
    def convergence_result(self) -> Optional[str]:
        unit = cast(ConvergenceHost, self).find_unit_with_tag(CONVERGENCE_RESULT_TAG)
        return getattr(unit, "operand", None) if unit else None

    @property
    def has_convergence(self) -> bool:
        return bool(self.convergence_param and self.convergence_result)

    def convergence_series(self, scope_track: Optional[List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
        if not self.has_convergence or not scope_track:
            return []

        last_result = object()
        series: List[Dict[str, Any]] = []
        for scope_item in scope_track:
            global_scope = ((scope_item or {}).get("scope") or {}).get("global") or {}
            param = global_scope.get(self.convergence_param)
            result = global_scope.get(self.convergence_result)
            is_new_result = result is not None and result != last_result
            last_result = result
            if is_new_result:
                series.append({"x": len(series) + 1, "param": param, "y": result})
        return series

    def _find_unit_for_convergence(self, result: str):
        for unit in cast(ConvergenceHost, self).units:
            for item in getattr(unit, "results", []) or []:
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
        # Used for type checking correctness
        host = cast(ConvergenceHost, self)
        parameter_name = ConvergenceParameterName(parameter)

        if result != ENERGY_CONVERGENCE_RESULT:
            raise ValueError(f"Unsupported convergence result: {result}")

        unit_for_convergence = self._find_unit_for_convergence(result)
        if unit_for_convergence is None:
            raise ValueError(f"Subworkflow does not contain a unit with '{result}' as an extracted property.")

        if parameter_name in (
            ConvergenceParameterName.N_k_nonuniform,
            ConvergenceParameterName.N_k_nonuniform_2D,
        ) and reciprocal_vector_ratios is None:
            reciprocal_vector_ratios = (
                ((getattr(unit_for_convergence, "context", {}) or {}).get("kgrid") or {}).get("reciprocalVectorRatios")
            )
            if reciprocal_vector_ratios is None:
                raise ValueError("Non-uniform k-grid convergence requires reciprocal_vector_ratios to be provided.")

        param = create_convergence_parameter(
            name=parameter_name.value,
            initial_value=parameter_initial,
            increment=parameter_increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )

        merged_context = self._merge_convergence_context(
            getattr(unit_for_convergence, "context", {}) or {},
            param.unit_context,
        )
        unit_for_convergence.set_context(merged_context)

        prev_result = "prev_result"
        iteration = "iteration"
        condition_expression = condition or f"abs(({prev_result}-{result})/{result})"

        param_init = Unit(
            name="init parameter",
            type="assignment",
            operand=param.name,
            value=param.initial_value,
            tags=[CONVERGENCE_PARAMETER_TAG],
        )
        prev_result_init = Unit(name="init result", type="assignment", operand=prev_result, value=result_initial)
        iter_init = Unit(name="init counter", type="assignment", operand=iteration, value=1)
        store_result = Unit(
            name="update result",
            type="assignment",
            input=[{"scope": unit_for_convergence.flowchartId, "name": result}],
            operand=result,
            value=result,
            tags=[CONVERGENCE_RESULT_TAG],
        )
        store_prev_result = Unit(
            name="store result",
            type="assignment",
            input=[{"scope": unit_for_convergence.flowchartId, "name": result}],
            operand=prev_result,
            value=result,
        )
        next_iter = Unit(name="update counter", type="assignment", operand=iteration, value=f"{iteration} + 1")
        next_step = Unit(
            name="update parameter",
            type="assignment",
            input=param.use_variables_from_unit_context(unit_for_convergence.flowchartId),
            operand=param.name,
            value=param.increment,
            next=unit_for_convergence.flowchartId,
        )
        exit_unit = Unit(name="exit", type="assignment", operand=param.name, value=param.final_value)
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

        next_step.next = unit_for_convergence.flowchartId
