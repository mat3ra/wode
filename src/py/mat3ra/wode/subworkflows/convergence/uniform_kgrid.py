from typing import Any, Dict

from .parameter import ConvergenceParameter


class UniformKGridConvergence(ConvergenceParameter):
    @property
    def increment(self) -> str:
        return f"{self.name} + {self._increment}"

    @property
    def unit_context(self) -> Dict[str, Any]:
        return self.build_points_grid_context(
            [f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}", f"{{{{{self.name}}}}}"]
        )

    @property
    def final_value(self) -> str:
        return f"{self.name} + 0"
