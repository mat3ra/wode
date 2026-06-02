from typing import Any, Dict, List, Union

from mat3ra.ade.context.context_provider import ContextProvider
from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.workflow.unit.base import WorkflowBaseUnitSchema
from mat3ra.utils.uuid import get_uuid
from pydantic import Field, field_validator

from .utils import (
    context_item_from_provider,
    context_items_from_input,
    parse_persisted_context,
    read_context_data,
    upsert_context_item,
)

ContextInput = Union[Dict[str, Any], ContextProvider]
ContextPayload = Union[Dict[str, Any], List[Dict[str, Any]], None]


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
    def _validate_context(cls, value: Any) -> List[Dict[str, Any]]:
        return parse_persisted_context(value)

    def get_hash_object(self) -> Dict[str, Any]:
        return {
            "results": self.results or [],
            "preProcessors": self.preProcessors or [],
            "postProcessors": self.postProcessors or [],
            "type": self.type,
        }

    def is_in_status(self, status: str) -> bool:
        return self.status == status

    def add_context(self, payload: ContextInput) -> None:
        if isinstance(payload, ContextProvider):
            items = [context_item_from_provider(payload)]
        else:
            items = context_items_from_input(payload)
        for item in items:
            self.context = upsert_context_item(self.context, item)

    def set_context(self, payload: ContextPayload) -> None:
        if not payload:
            self.context = []
            return
        if isinstance(payload, list):
            self.context = parse_persisted_context(payload)
            return
        self.context = context_items_from_input(payload)

    def get_context(self, key: str, default: Any = None) -> Any:
        for item in self.context:
            if item.get("name") == key:
                return read_context_data(item, default)
        return default

    def remove_context(self, key: str) -> None:
        self.context = [item for item in self.context if item.get("name") != key]

    def clear_context(self) -> None:
        self.context = []
