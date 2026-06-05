from typing import Any, Dict

from mat3ra.ade.context.context_provider import ContextProvider as AdeContextProvider

# TODO: Remove context provider from Ade -- sync with JS implementation fully
class ContextProvider(AdeContextProvider):
    def get_context_item_data(self) -> Dict[str, Any]:
        return {
            "name": self.name_str,
            "isEdited": self.is_edited,
            "data": self.get_data(),
            "extraData": self.extra_data or {},
        }
