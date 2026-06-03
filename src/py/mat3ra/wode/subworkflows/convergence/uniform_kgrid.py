from typing import Any, Dict, List, Optional

from ...context.providers import PointsGridDataProvider
from ...units.execution import ExecutionUnit
from .parameter import ConvergenceParameter


class UniformKGridConvergence(ConvergenceParameter):
    def _points_grid_context(
        self, dimensions: List[str], reciprocal_vector_ratios: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        return PointsGridDataProvider().yield_data_with_overrides(
            dimensions=dimensions,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
            is_using_jinja_variables=True,
        )

    @property
    def increment(self) -> str:
        return f"{self.name} + {self._increment}"

    @property
    def unit_context(self) -> Dict[str, Any]:
        yielded = self._points_grid_context(
            dimensions=[f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}"],
        )
        return ExecutionUnit.context_item(
            "kgrid",
            yielded["kgrid"],
            is_edited=True,
            extra_data=yielded.get("kgridExtraData") or {},
        )

    @property
    def final_value(self) -> str:
        return f"{self.name} + 0"
