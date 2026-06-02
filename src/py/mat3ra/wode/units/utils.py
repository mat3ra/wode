from typing import Any, Dict, List, Union

from mat3ra.ade.context.context_provider import ContextProvider

PersistedContextItem = Dict[str, Any]
ContextInput = Union[Dict[str, Any], ContextProvider]

_EXTRA_DATA_SUFFIX = "ExtraData"


def to_persisted_context_item(item: Dict[str, Any]) -> PersistedContextItem:
    return {
        "name": item["name"],
        "isEdited": bool(item.get("isEdited", False)),
        "data": item.get("data", {}),
        "extraData": item.get("extraData") or {},
    }


def parse_persisted_context(value: Any) -> List[PersistedContextItem]:
    if value in (None, {}):
        return []
    if not isinstance(value, list):
        return value
    return [to_persisted_context_item(item) for item in value if isinstance(item, dict) and item.get("name")]


def is_persisted_context_item(payload: Dict[str, Any]) -> bool:
    return "name" in payload and "data" in payload


def _edited_flag_key(name: str) -> str:
    return f"is{name[0].upper()}{name[1:]}Edited"


def _extra_data_key(name: str) -> str:
    return f"{name}{_EXTRA_DATA_SUFFIX}"


def _data_names(flat: Dict[str, Any]) -> List[str]:
    names = [key for key in flat if not key.endswith(_EXTRA_DATA_SUFFIX)]
    edited_flag_names = {_edited_flag_key(name) for name in names if _edited_flag_key(name) in flat}
    return [name for name in names if name not in edited_flag_names]


def context_item_from_provider(provider: ContextProvider) -> PersistedContextItem:
    data = provider.yield_data()
    name = provider.name_str
    value = data[name]
    return to_persisted_context_item(
        {
            "name": name,
            "isEdited": bool(data.get(provider.is_edited_key, False)),
            "data": value if isinstance(value, dict) else {"value": value},
            "extraData": data.get(provider.extra_data_key) or {},
        }
    )


def context_items_from_flat_context(flat: Dict[str, Any]) -> List[PersistedContextItem]:
    items: List[PersistedContextItem] = []
    for name in _data_names(flat):
        value = flat[name]
        items.append(
            to_persisted_context_item(
                {
                    "name": name,
                    "isEdited": bool(flat.get(_edited_flag_key(name), False)),
                    "data": value if isinstance(value, dict) else {"value": value},
                    "extraData": flat.get(_extra_data_key(name)) or {},
                }
            )
        )
    return items


def context_items_from_input(payload: Dict[str, Any]) -> List[PersistedContextItem]:
    if is_persisted_context_item(payload):
        return [to_persisted_context_item(payload)]
    return context_items_from_flat_context(payload)


def read_context_data(item: PersistedContextItem, default: Any = None) -> Any:
    data = item.get("data", default)
    if isinstance(data, dict) and set(data) == {"value"}:
        return data["value"]
    return data


def upsert_context_item(items: List[PersistedContextItem], item: Dict[str, Any]) -> List[PersistedContextItem]:
    persisted_item = to_persisted_context_item(item)
    name = persisted_item["name"]
    return [entry for entry in items if entry.get("name") != name] + [persisted_item]
