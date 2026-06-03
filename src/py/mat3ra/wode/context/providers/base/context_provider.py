from copy import deepcopy
from typing import Any, Dict, Optional

from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.esse.models.context_provider import ContextProviderSchema


class ContextProvider(ContextProviderSchema, InMemoryEntitySnakeCase):
    @property
    def default_data(self) -> Optional[Any]:
        return None

    @property
    def name_str(self) -> str:
        return self.name.value if hasattr(self.name, "value") else str(self.name)

    @property
    def extra_data_key(self) -> str:
        return f"{self.name_str}ExtraData"

    @property
    def is_edited_key(self) -> str:
        return f"is{self.name_str}Edited"

    def get_data(self) -> Any:
        if self.data is not None:
            return deepcopy(self.data)
        return deepcopy(self.default_data)

    def set_data(self, data: Any) -> None:
        self.data = deepcopy(data)

    def patch_for_rendering(self, data: Any) -> Any:
        return data

    def get_data_for_rendering(self) -> Any:
        return self.patch_for_rendering(self.get_data())

    def get_context_item_data(self) -> Dict[str, Any]:
        return {
            "name": self.name_str,
            "isEdited": bool(self.is_edited),
            "data": self.get_data(),
            "extraData": deepcopy(self.extra_data) if self.extra_data is not None else {},
        }

    def get_context_item_data_for_rendering(self) -> Dict[str, Any]:
        return {
            **self.get_context_item_data(),
            "data": self.get_data_for_rendering(),
        }

    @staticmethod
    def find_context_item(unit_context: Any, context_name: str) -> Dict[str, Any]:
        if not isinstance(unit_context, list):
            return {}
        item = next(
            (
                context_item
                for context_item in unit_context
                if isinstance(context_item, dict) and context_item.get("name") == context_name
            ),
            None,
        )
        return item or {}

    def _get_data_from_context(self, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not context:
            return {}
        data = context.get(self.name_str)
        is_edited = context.get(self.is_edited_key)
        extra_data = context.get(self.extra_data_key)
        result: Dict[str, Any] = {}
        if data is not None:
            result["data"] = data
        if is_edited is not None:
            result["is_edited"] = is_edited
        if extra_data is not None:
            result["extra_data"] = extra_data
        return result

    def _get_effective_data(self, context: Optional[Dict[str, Any]] = None) -> Any:
        context_data = self._get_data_from_context(context or self.context)
        effective_data = context_data.get("data", self.data)
        if effective_data is not None:
            return effective_data
        return deepcopy(self.default_data)

    def _get_effective_is_edited(self, context: Optional[Dict[str, Any]] = None) -> bool:
        context_data = self._get_data_from_context(context or self.context)
        return bool(context_data.get("is_edited", self.is_edited))

    def _get_effective_extra_data(self, context: Optional[Dict[str, Any]] = None) -> Optional[Any]:
        context_data = self._get_data_from_context(context or self.context)
        return context_data.get("extra_data", self.extra_data)

    def yield_data(self, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        data = self._get_effective_data(context)
        is_edited = self._get_effective_is_edited(context)
        extra_data = self._get_effective_extra_data(context)
        result = {self.name_str: data, self.is_edited_key: is_edited}
        if extra_data:
            result[self.extra_data_key] = extra_data
        return result

    def yield_data_for_rendering(self, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self.yield_data(context)
