import json
from typing import Any, Dict, List


class ConvergenceParameter:
    def __init__(self, name: str, initial_value: Any, increment: Any):
        self.name = name
        self._initial_value = initial_value
        self._increment = increment

    @property
    def initial_value(self) -> str:
        if isinstance(self._initial_value, str):
            return self._initial_value
        return json.dumps(self._initial_value, separators=(",", ":"))

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
