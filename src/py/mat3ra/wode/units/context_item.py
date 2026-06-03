from collections.abc import Mapping
from typing import Any, Dict

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ContextItem(BaseModel):
    name: str
    isEdited: bool = True
    data: Any = Field(default_factory=dict)
    extraData: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(extra="ignore")

    @field_validator("data", mode="before")
    @classmethod
    def _normalize_data(cls, value: Any) -> Dict[str, Any]:
        return value if isinstance(value, dict) else {"value": value}

    @field_validator("extraData", mode="before")
    @classmethod
    def _normalize_extra_data(cls, value: Any) -> Dict[str, Any]:
        return value if isinstance(value, dict) else {}

    @classmethod
    def from_persisted(cls, item: Mapping[str, Any], *, default_is_edited: bool = True) -> "ContextItem":
        name = item.get("name")
        if not name:
            raise ValueError("Context item must contain a name")
        return cls(
            name=str(name),
            isEdited=bool(item.get("isEdited", default_is_edited)),
            data=item.get("data"),
            extraData=item.get("extraData"),
        )

    @classmethod
    def from_provider_yield(cls, yielded: Mapping[str, Any]) -> "ContextItem":
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
                extra_data = value if isinstance(value, dict) else {}
                continue
            if name is not None:
                raise ValueError("yield_data() must contain a single provider data key")
            name = key
            data = value
        if name is None:
            raise ValueError("yield_data() must contain a provider data key")
        return cls(name=name, isEdited=is_edited, data=data, extraData=extra_data)

    @classmethod
    def from_value(cls, value: Any, *, default_is_edited: bool = True) -> "ContextItem":
        if isinstance(value, cls):
            return value
        if isinstance(value, Mapping):
            if "name" in value:
                return cls.from_persisted(value, default_is_edited=default_is_edited)
            return cls.from_provider_yield(value)
        raise TypeError("Context item must be a mapping or ContextItem")

    def get(self, key: str, default: Any = None) -> Any:
        return getattr(self, key, default)

    def read_data(self, default: Any = None) -> Any:
        data = self.data if self.data is not None else default
        if isinstance(data, dict) and set(data) == {"value"}:
            return data["value"]
        return data

    def as_dict(self) -> Dict[str, Any]:
        return self.model_dump()
