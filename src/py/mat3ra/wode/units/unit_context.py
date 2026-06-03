from typing import Any, Iterable, List, Optional

from pydantic import Field, RootModel

from .context_item import ContextItem


class UnitContext(RootModel[List[ContextItem]]):
    root: List[ContextItem] = Field(default_factory=list)

    @classmethod
    def from_value(cls, value: Any, *, default_is_edited: bool = False) -> "UnitContext":
        if isinstance(value, cls):
            return value
        if value is None:
            return cls([])
        if isinstance(value, list):
            items = []
            for entry in value:
                try:
                    items.append(ContextItem.from_value(entry, default_is_edited=default_is_edited))
                except (TypeError, ValueError):
                    continue
            return cls(items)
        if isinstance(value, ContextItem):
            return cls([value])
        return cls.model_validate(value)

    def get(self, name: str) -> Optional[ContextItem]:
        return next((item for item in self.root if item.name == name), None)

    def get_data(self, name: str, default: Any = None) -> Any:
        item = self.get(name)
        return item.read_data(default) if item else default

    def add(self, item: Any) -> None:
        self.upsert(item)

    def upsert(self, item: Any) -> None:
        context_item = ContextItem.from_value(item, default_is_edited=True)
        self.root = [entry for entry in self.root if entry.name != context_item.name] + [context_item]

    def set_items(self, items: Iterable[Any]) -> None:
        self.root = UnitContext.from_value(list(items), default_is_edited=False).root

    def remove(self, name: str) -> None:
        self.root = [item for item in self.root if item.name != name]

    def clear(self) -> None:
        self.root = []

    def __iter__(self):
        return iter(self.root)

    def __len__(self) -> int:
        return len(self.root)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, list):
            return [item.as_dict() for item in self.root] == other
        return super().__eq__(other)
