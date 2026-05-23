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
from pydantic import Field

from .unit import Unit


class ExecutionUnit(Unit, ExecutionUnitSchemaBase):
    type: Literal["execution"] = "execution"
    executable: Executable = None
    flavor: Flavor = None
    application: Application = None
    input: List = Field(default_factory=list)

    def replace_in_input_content(self, pattern: str, replacement: str, input_name=None) -> None:
        for item in self.input:
            if isinstance(item, dict) and "content" in item and (input_name is None or item.get("name") == input_name):
                item["content"] = replace_in_text(item["content"], pattern, replacement)

    def get_hash_object(self) -> Dict[str, Any]:
        app = self.application.to_dict() if self.application else {}
        app.pop("isUsingMaterial", None)  # Exclude from hash to match JavaScript
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
