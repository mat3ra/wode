from typing import Any, Dict, List, Literal

from mat3ra.ade import Application, Executable, Flavor
from mat3ra.esse.models.workflow.unit.execution import ExecutionUnitSchemaBase
from mat3ra.utils import (
    calculate_hash_from_object,
    remove_comments_from_source_code,
    remove_empty_lines_from_string,
    remove_timestampable_keys,
)
from mat3ra.utils.extra.jinja import replace_in_text
from pydantic import Field, field_validator

from .execution_unit_input import ExecutionUnitInput
from .unit import Unit


class ExecutionUnit(Unit, ExecutionUnitSchemaBase):
    type: Literal["execution"] = "execution"
    executable: Executable = None
    flavor: Flavor = None
    application: Application = None
    input: List[ExecutionUnitInput] = Field(default_factory=list)

    @field_validator("input", mode="before")
    @classmethod
    def _instantiate_input(cls, value: Any) -> List[ExecutionUnitInput]:
        if not isinstance(value, list):
            return []
        instantiated: List[ExecutionUnitInput] = []
        for item in value:
            if isinstance(item, ExecutionUnitInput):
                instantiated.append(item)
            elif isinstance(item, dict):
                instantiated.append(ExecutionUnitInput(**item))
        return instantiated

    def replace_in_input_content(self, pattern: str, replacement: str, input_name=None) -> None:
        for item in self.input:
            if input_name is None or item.template.name == input_name:
                item.template.content = replace_in_text(item.template.content, pattern, replacement)

    def get_hash_object(self) -> Dict[str, Any]:
        app = self.application.to_dict() if self.application else {}
        exe = self.executable.to_dict() if self.executable else {}
        flv = self.flavor.to_dict() if self.flavor else {}
        input_hash = calculate_hash_from_object(
            [
                remove_empty_lines_from_string(remove_comments_from_source_code(item.template.content))
                for item in self.input
            ]
        )
        return {
            **super().get_hash_object(),
            "application": remove_timestampable_keys(app),
            "executable": remove_timestampable_keys(exe),
            "flavor": remove_timestampable_keys(flv),
            "input": input_hash,
        }
