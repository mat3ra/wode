from typing import Any, Dict, List, Literal

from mat3ra.ade import Application, Executable, Flavor, Template
from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.esse.models.workflow.unit.execution import ExecutionUnitSchemaBase
from mat3ra.utils import (
    calculate_hash_from_object,
    remove_comments_from_source_code,
    remove_empty_lines_from_string,
    remove_timestampable_keys,
)
from pydantic import Field, model_serializer, model_validator

from .unit import Unit

_ITEM_KEYS = {"rendered", "isManuallyChanged"}


# TODO: use from ESSE when epic/SOF-7756 merged
class ExecutionUnitInputItem(InMemoryEntitySnakeCase):
    template: Template = Field(default_factory=Template)
    rendered: str = ""
    isManuallyChanged: bool = False

    @model_validator(mode="before")
    @classmethod
    def from_flat(cls, data: Any) -> Any:
        if isinstance(data, dict) and "template" not in data:
            return {
                "template": {k: v for k, v in data.items() if k not in _ITEM_KEYS},
                "rendered": data.get("rendered", ""),
                "isManuallyChanged": data.get("isManuallyChanged", False),
            }
        return data

    @model_serializer(mode="plain")
    def to_flat(self) -> Dict[str, Any]:
        return {**self.template.to_dict(), "rendered": self.rendered, "isManuallyChanged": self.isManuallyChanged}


class ExecutionUnit(Unit, ExecutionUnitSchemaBase):
    type: Literal["execution"] = "execution"
    executable: Executable = None
    flavor: Flavor = None
    application: Application = None
    input: List[ExecutionUnitInputItem] = Field(default_factory=List[ExecutionUnitInputItem])

    def replace_in_input_content(self, pattern: str, replacement: str) -> None:
        for input_item in self.input:
            input_item.template.replace_in_content(pattern, replacement)

    def replace_variable_value_in_inputs(self, variable_name: str, new_value: str) -> None:
        for input_item in self.input:
            input_item.template.replace_variable_value(variable_name, new_value)

    def get_hash_object(self) -> Dict[str, Any]:
        app = self.application.to_dict() if self.application else {}
        exe = self.executable.to_dict() if self.executable else {}
        flv = self.flavor.to_dict() if self.flavor else {}
        input_items = self.input if isinstance(self.input, list) else []
        input_hash = calculate_hash_from_object(
            [remove_empty_lines_from_string(remove_comments_from_source_code(i.template.content)) for i in input_items]
        )
        return {
            **super().get_hash_object(),
            "application": remove_timestampable_keys(app),
            "executable": remove_timestampable_keys(exe),
            "flavor": remove_timestampable_keys(flv),
            "input": input_hash,
        }
