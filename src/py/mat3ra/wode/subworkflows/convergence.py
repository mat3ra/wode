import copy
import json
from typing import Any, Dict, List, Optional

import numpy as np

from ..units import Unit

CONVERGENCE_PARAMETER_TAG = "hasConvergenceParam"
CONVERGENCE_RESULT_TAG = "hasConvergenceResult"
ENERGY_CONVERGENCE_RESULT = "total_energy"


def _compact_json(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"))


def _deep_merge(base: Dict[str, Any], update: Dict[str, Any]) -> Dict[str, Any]:
    merged = copy.deepcopy(base)
    for key, value in update.items():
        base_value = merged.get(key)
        if isinstance(base_value, dict) and isinstance(value, dict):
            merged[key] = _deep_merge(base_value, value)
        else:
            merged[key] = copy.deepcopy(value)
    return merged


def _get_result_name(result: Any) -> Optional[str]:
    if isinstance(result, dict):
        return result.get("name")
    return result if isinstance(result, str) else None


class ConvergenceParameter:
    def __init__(self, name: str, initial_value: Any, increment: Any):
        self.name = name
        self._initial_value = initial_value
        self._increment = increment

    @property
    def initial_value(self) -> str:
        if isinstance(self._initial_value, str):
            return self._initial_value
        return _compact_json(self._initial_value)

    @property
    def increment(self) -> str:
        return ""

    @property
    def unit_context(self) -> Dict[str, Any]:
        return {}

    @property
    def final_value(self) -> str:
        return self.name

    def use_variables_from_unit_context(self, flowchart_id: str) -> List[Dict[str, str]]:
        return []


class UniformKGridConvergence(ConvergenceParameter):
    @property
    def increment(self) -> str:
        return f"{self.name} + {self._increment}"

    @property
    def unit_context(self) -> Dict[str, Any]:
        return {
            "kgrid": {
                "dimensions": [f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}"],
                "shifts": [0, 0, 0],
            },
            "isKgridEdited": True,
            "isUsingJinjaVariables": True,
        }

    @property
    def final_value(self) -> str:
        return f"{self.name} + 0"


class NonUniformKGridConvergence(ConvergenceParameter):
    def __init__(
        self,
        name: str,
        initial_value: Any,
        increment: Any,
        reciprocal_vector_ratios: Optional[List[float]] = None,
    ):
        super().__init__(name=name, initial_value=initial_value, increment=increment)
        self._reciprocal_vector_ratios = reciprocal_vector_ratios

    @property
    def increment(self) -> str:
        return (
            f"[{self.initial_value}[i] + math.floor(iteration * {self._increment} * "
            "float(context['kgrid']['reciprocalVectorRatios'][i])) for i in range(3)]"
        )

    @property
    def unit_context(self) -> Dict[str, Any]:
        kgrid_context: Dict[str, Any] = {
            "dimensions": [
                f"{{{{{self.name}[0]}}}}",
                f"{{{{{self.name}[1]}}}}",
                f"{{{{{self.name}[2]}}}}",
            ],
            "shifts": [0, 0, 0],
        }
        if self._reciprocal_vector_ratios is not None:
            kgrid_context["reciprocalVectorRatios"] = self._reciprocal_vector_ratios

        return {
            "kgrid": kgrid_context,
            "isKgridEdited": True,
            "isUsingJinjaVariables": True,
        }

    def use_variables_from_unit_context(self, flowchart_id: str) -> List[Dict[str, str]]:
        return [{"scope": flowchart_id, "name": "context"}]


def create_convergence_parameter(
    name: str,
    initial_value: Any,
    increment: Any,
    reciprocal_vector_ratios: Optional[List[float]] = None,
) -> ConvergenceParameter:
    if name == "N_k":
        return UniformKGridConvergence(name=name, initial_value=initial_value, increment=increment)
    if name == "N_k_nonuniform":
        return NonUniformKGridConvergence(
            name=name,
            initial_value=initial_value,
            increment=increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )
    raise ValueError(f"Unsupported convergence parameter: {name}")


def calculate_reciprocal_vector_ratios_from_lattice_vectors(lattice_vectors: List[List[float]]) -> List[float]:
    lattice = np.array(lattice_vectors, dtype=float)
    reciprocal = 2 * np.pi * np.linalg.inv(lattice).T
    norms = np.linalg.norm(reciprocal, axis=1)
    min_norm = np.min(norms)
    return [round(float(value / min_norm), 3) for value in norms]


class ConvergenceMixin:
    @property
    def scope_variables(self) -> List[str]:
        return ["N_k", "N_k_nonuniform"]

    @property
    def scalar_results(self) -> List[str]:
        return [ENERGY_CONVERGENCE_RESULT]

    @property
    def convergence_param(self) -> Optional[str]:
        unit = self.find_unit_with_tag(CONVERGENCE_PARAMETER_TAG)
        return getattr(unit, "operand", None) if unit else None

    @property
    def convergence_result(self) -> Optional[str]:
        unit = self.find_unit_with_tag(CONVERGENCE_RESULT_TAG)
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
                series.append(
                    {
                        "x": len(series) + 1,
                        "param": param,
                        "y": result,
                    }
                )
        return series

    def _find_unit_for_convergence(self, result: str):
        for unit in self.units:
            result_names = [_get_result_name(item) for item in getattr(unit, "results", []) or []]
            if result in result_names:
                return unit
        return None

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
        if result != ENERGY_CONVERGENCE_RESULT:
            raise ValueError(f"Unsupported convergence result: {result}")

        unit_for_convergence = self._find_unit_for_convergence(result)
        if unit_for_convergence is None:
            raise ValueError(f"Subworkflow does not contain a unit with '{result}' as an extracted property.")

        if parameter == "N_k_nonuniform" and reciprocal_vector_ratios is None:
            reciprocal_vector_ratios = (
                ((getattr(unit_for_convergence, "context", {}) or {}).get("kgrid") or {}).get("reciprocalVectorRatios")
            )
            if reciprocal_vector_ratios is None:
                raise ValueError(
                    "Non-uniform k-grid convergence requires reciprocal_vector_ratios to be provided."
                )

        param = create_convergence_parameter(
            name=parameter,
            initial_value=parameter_initial,
            increment=parameter_increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )

        merged_context = _deep_merge(getattr(unit_for_convergence, "context", {}) or {}, param.unit_context)
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
        prev_result_init = Unit(
            name="init result",
            type="assignment",
            operand=prev_result,
            value=result_initial,
        )
        iter_init = Unit(
            name="init counter",
            type="assignment",
            operand=iteration,
            value=1,
        )
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
        next_iter = Unit(
            name="update counter",
            type="assignment",
            operand=iteration,
            value=f"{iteration} + 1",
        )
        next_step = Unit(
            name="update parameter",
            type="assignment",
            input=param.use_variables_from_unit_context(unit_for_convergence.flowchartId),
            operand=param.name,
            value=param.increment,
            next=unit_for_convergence.flowchartId,
        )
        exit_unit = Unit(
            name="exit",
            type="assignment",
            operand=param.name,
            value=param.final_value,
        )
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

        self.add_unit(param_init, index=0)
        self.add_unit(prev_result_init, index=1)
        self.add_unit(iter_init, index=2)
        self.add_unit(store_result)
        self.add_unit(condition_unit)
        self.add_unit(store_prev_result)
        self.add_unit(next_iter)
        self.add_unit(next_step)
        self.add_unit(exit_unit)

        next_step.next = unit_for_convergence.flowchartId
