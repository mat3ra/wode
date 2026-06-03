from typing import Any, Dict, List, Literal, Optional

from mat3ra.ade import Application, Executable, Flavor
from mat3ra.ade.context.context_provider import ContextProvider
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
    executable: Executable = None
    flavor: Flavor = None
    application: Application = None
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
    def _validate_context(cls, value: Any) -> List[Dict[str, Any]]:
        if value is None:
            return []
        if not isinstance(value, list):
            return value
        return [{
            "name": item["name"],
            "isEdited": bool(item.get("isEdited", False)),
            "data": item.get("data", {}),
            "extraData": item.get("extraData") or {},
        } for item in value if isinstance(item, dict) and item.get("name")]

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

    @staticmethod
    def _read_context_data(item: Dict[str, Any], default: Any = None) -> Any:
        data = item.get("data", default)
        if isinstance(data, dict) and set(data) == {"value"}:
            return data["value"]
        return data

    @staticmethod
    def context_item(
        name: str,
        data: Any,
        *,
        is_edited: bool = True,
        extra_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = data if isinstance(data, dict) else {"value": data}
        return {
            "name": name,
            "isEdited": is_edited,
            "data": payload,
            "extraData": extra_data or {},
        }

    def _replace_context_item(self, name: str, item: Dict[str, Any]) -> None:
        rest = [entry for entry in self.context if self._context_item_name(entry) != name]
        self.context = rest + [item]

    @staticmethod
    def _normalized_context_item(item: Dict[str, Any]) -> Dict[str, Any]:
        if "name" in item:
            return ExecutionUnit.context_item(
                item["name"],
                item.get("data"),
                is_edited=bool(item.get("isEdited", True)),
                extra_data=item.get("extraData") or {},
            )
        return ExecutionUnit._context_item_from_provider_yield(item)

    @staticmethod
    def _context_item_from_provider_yield(yielded: Dict[str, Any]) -> Dict[str, Any]:
        name = None
        data = None
        is_edited = True
        extra_data: Dict[str, Any] = {}
        for key, value in yielded.items():
            if key == "isUsingJinjaVariables":
                continue
            if key.startswith("is") and key.endswith("Edited"):
                is_edited = bool(value)
                continue
            if key.endswith("ExtraData"):
                extra_data = value or {}
                continue
            if name is not None:
                raise ValueError("yield_data() must contain a single provider data key")
            name = key
            data = value
        if name is None:
            raise ValueError("yield_data() must contain a provider data key")
        return ExecutionUnit.context_item(name, data, is_edited=is_edited, extra_data=extra_data)

    def add_context(self, item: Dict[str, Any]) -> None:
        normalized = self._normalized_context_item(item)
        self._replace_context_item(normalized["name"], normalized)

    def add_context_provider(self, provider: ContextProvider) -> None:
        self.add_context(provider.yield_data())

    def set_context(self, items: Context) -> None:
        self.context = items

    def get_context(self, name: str, default: Any = None) -> Any:
        item = self.get_context_item(name)
        return self._read_context_data(item, default) if item else default

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
