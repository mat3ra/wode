from typing import Any, Dict, List, Optional

from .uniform_kgrid import UniformKGridConvergence


class NonUniformKGridConvergence(UniformKGridConvergence):
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
        return self._points_grid_context(
            dimensions=[
                f"{{{{{self.name}[0]}}}}",
                f"{{{{{self.name}[1]}}}}",
                f"{{{{{self.name}[2]}}}}",
            ],
            reciprocal_vector_ratios=self._reciprocal_vector_ratios,
        )

    def use_variables_from_unit_context(self, flowchart_id: str) -> List[Dict[str, str]]:
        return [{"scope": flowchart_id, "name": "context"}]
