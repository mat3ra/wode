from typing import Any, Dict

from .parameter import ConvergenceParameter


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
