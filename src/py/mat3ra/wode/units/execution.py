from typing import Any, Dict, List, Literal, Optional

from mat3ra.ade import Application, Executable, Flavor
from mat3ra.esse.models.workflow.unit.execution import ExecutionUnitSchema, ContextItemSchema
from mat3ra.utils import (
    calculate_hash_from_object,
    remove_comments_from_source_code,
    remove_empty_lines_from_string,
)
from mat3ra.utils.extra.jinja import replace_in_text
from pydantic import Field, field_validator

from .execution_unit_input import ExecutionUnitInput
from .unit import Unit

Context = List[ContextItemSchema]

class ExecutionUnit(Unit, ExecutionUnitSchema):
    type: Literal["execution"] = "execution"
    application: Application
    executable: Executable
    flavor: Flavor
    input: List[ExecutionUnitInput] = Field(default_factory=list)
    context: Context = Field(default_factory=list)

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


    @field_validator("context", mode="before")
    @classmethod
    def _coerce_context(cls, value: Any) -> Any:
        if value is None:
            return []
        return value

    @staticmethod
    def _context_item_name(item: Any) -> Optional[str]:
        if isinstance(item, dict):
            return item.get("name")
        name = getattr(item, "name", None)
        return str(name) if name is not None else None

    def get_context_item(self, name: str) -> Optional[Dict[str, Any]]:
        for item in self.context:
            if self._context_item_name(item) == name:
                return item if isinstance(item, dict) else item.model_dump()
        return None

    def add_context(self, item: Dict[str, Any]) -> None:
        existing_item = self.get_context_item(item["name"])
        if existing_item:
            existing_item.update(item)
        else:
            self.context.append(item)

    def get_context(self, name: str, default: Any = None) -> Any:
        item = self.get_context_item(name)
        return item.get("data", default) if item else default

    def remove_context(self, name: str) -> None:
        self.context = [item for item in self.context if self._context_item_name(item) != name]

    def clear_context(self) -> None:
        self.context = []

    def replace_in_input_content(self, pattern: str, replacement: str, input_name=None) -> None:
        for item in self.input:
            if input_name is None or item.template.name == input_name:
                item.template.content = replace_in_text(item.template.content, pattern, replacement)

    def get_hash_object(self) -> Dict[str, Any]:
        data = self.to_dict()
        application = dict(data.get("application") or {})
        application.pop("isLicensed", None)
        if application.get("isDefault") and "isDefaultVersion" not in application:
            application["isDefaultVersion"] = True

        executable_source = data.get("executable") or {}
        executable = {
            "applicationName": executable_source.get("applicationName"),
            "applicationVersion": "*",
            "hasAdvancedComputeOptions": executable_source.get("hasAdvancedComputeOptions", False),
            "isDefault": executable_source.get("isDefault", False),
            "name": executable_source.get("name"),
            "schemaVersion": executable_source.get("schemaVersion", "2022.8.16"),
        }

        flavor_source = data.get("flavor") or {}
        flavor = {
            "applicationName": flavor_source.get("applicationName"),
            "applicationVersion": "*",
            "executableName": flavor_source.get("executableName"),
            "input": flavor_source.get("input") or [],
            "isDefault": flavor_source.get("isDefault", False),
            "monitors": flavor_source.get("monitors") or [],
            "name": flavor_source.get("name"),
            "postProcessors": flavor_source.get("postProcessors") or [],
            "preProcessors": flavor_source.get("preProcessors") or [],
            "results": flavor_source.get("results") or [],
            "schemaVersion": flavor_source.get("schemaVersion", "2022.8.16"),
        }

        input_hash = calculate_hash_from_object(
            [
                remove_empty_lines_from_string(remove_comments_from_source_code(item.template.content))
                for item in self.input
            ]
        )
        return {
            **super().get_hash_object(),
            "application": application,
            "executable": executable,
            "flavor": flavor,
            "input": input_hash,
        }
