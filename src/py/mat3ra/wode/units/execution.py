from typing import Any, Dict, List, Literal, Optional

from mat3ra.ade import Application, Executable, Flavor, Template
from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.esse.models.workflow.unit.execution import ExecutionUnitSchemaBase
from mat3ra.utils import (
    calculate_hash_from_object,
    remove_comments_from_source_code,
    remove_empty_lines_from_string,
    remove_timestampable_keys,
)
from pydantic import Field

from .unit import Unit


# TODO: use from ESSE when epic/SOF-7756 merged
class ExecutionUnitInputItem(InMemoryEntitySnakeCase):
    template: Template = Field(default_factory=Template)
    rendered: str
    isManuallyChanged: bool = False


class ExecutionUnit(Unit, ExecutionUnitSchemaBase):
    type: Literal["execution"] = "execution"
    executable: Executable = None
    flavor: Flavor = None
    application: Application = None
    input: List[ExecutionUnitInputItem] = Field(default_factory=List[ExecutionUnitInputItem])

    def get_hash_object(self) -> Dict[str, Any]:
        app = self.application.to_dict() if self.application else {}
        exe = self.executable.to_dict() if self.executable else {}
        flv = self.flavor.to_dict() if self.flavor else {}
        input_items = self.input if isinstance(self.input, list) else []
        input_hash = calculate_hash_from_object(
            [
                remove_empty_lines_from_string(remove_comments_from_source_code(i.get("content", "")))
                for i in input_items
                if isinstance(i, dict)
            ]
        )
        return {
            **super().get_hash_object(),
            "application": remove_timestampable_keys(app),
            "executable": remove_timestampable_keys(exe),
            "flavor": remove_timestampable_keys(flv),
            "input": input_hash,
        }
