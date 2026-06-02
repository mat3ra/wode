from typing import Any, Dict, List

from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.workflow.unit.base import WorkflowBaseUnitSchema
from mat3ra.utils.uuid import get_uuid
from pydantic import Field, field_validator


class Unit(WorkflowBaseUnitSchema, HashedEntityMixin, InMemoryEntitySnakeCase):
    """
    Unit class representing a unit of computational work in a workflow.

    Attributes:
        type: Type of the unit (e.g., execution, assignment, condition)
        name: Name of the unit
        flowchartId: Unique identifier for the unit in the flowchart
        head: Whether this unit is the head of the workflow
        next: Flowchart ID of the next unit
        tags: List of tags for the unit
        context: Persisted context provider items for the unit
    """
    id: str = Field(default_factory=get_uuid, alias="_id")
    flowchartId: str = Field(default_factory=get_uuid)
    # TODO: use RuntimeItemNameObjectSchema when available
    preProcessors: List[Any] = Field(default_factory=list)
    postProcessors: List[Any] = Field(default_factory=list)
    monitors: List[Any] = Field(default_factory=list)
    results: List[Any] = Field(default_factory=list)
    context: List[Dict[str, Any]] = Field(default_factory=list)

    @field_validator("context", mode="before")
    @classmethod
    def _coerce_context(cls, value: Any) -> List[Dict[str, Any]]:
        if value in (None, {}):
            return []
        return value

    def get_hash_object(self) -> Dict[str, Any]:
        return {
            "results": self.results or [],
            "preProcessors": self.preProcessors or [],
            "postProcessors": self.postProcessors or [],
            "type": self.type,
        }

    def is_in_status(self, status: str) -> bool:
        return self.status == status

    def add_context(self, new_context: Dict[str, Any]):
        if "name" in new_context and "data" in new_context:
            self._upsert_context_item(new_context)
            return
        for key, value in new_context.items():
            if key.startswith("is") and key.endswith("Edited"):
                continue
            edited = new_context.get(f"is{key[0].upper()}{key[1:]}Edited", False)
            data = value if isinstance(value, dict) else {"value": value}
            self._upsert_context_item({"name": key, "isEdited": bool(edited), "data": data})

    def set_context(self, new_context: Dict[str, Any] | List[Dict[str, Any]] | None):
        if new_context in (None, {}, []):
            self.context = []
            return
        if isinstance(new_context, list):
            self.context = new_context
            return
        self.context = []
        self.add_context(new_context)

    def get_context(self, key: str, default: Any = None) -> Any:
        for item in self.context:
            if item.get("name") != key:
                continue
            data = item.get("data", default)
            if isinstance(data, dict) and set(data) == {"value"}:
                return data["value"]
            return data
        return default

    def remove_context(self, key: str):
        self.context = [item for item in self.context if item.get("name") != key]

    def clear_context(self):
        self.context = []

    def _upsert_context_item(self, item: Dict[str, Any]):
        name = item["name"]
        self.context = [existing for existing in self.context if existing.get("name") != name] + [item]
