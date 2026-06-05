from typing import Any, Dict, List, Optional

from ...context.providers import PointsGridDataProvider
from .parameter import ConvergenceParameter


class UniformKGridConvergence(ConvergenceParameter):
    def _points_grid_context(
        self, dimensions: List[str], reciprocal_vector_ratios: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        provider = PointsGridDataProvider(isEdited=True)
        provider.data = provider.build_data(
            dimensions=dimensions,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )
        return provider.get_context_item_data()

    @property
    def increment(self) -> str:
        return f"{self.name} + {self._increment}"

    @property
    def unit_context(self) -> Dict[str, Any]:
        return self._points_grid_context(
            dimensions=[f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}"],
        )

    @property
    def final_value(self) -> str:
        return f"{self.name} + 0"
