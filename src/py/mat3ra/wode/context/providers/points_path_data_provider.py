from typing import Any, Dict, List

from mat3ra.ade.context.context_provider import ContextProvider
from mat3ra.esse.models.context_providers_directory.points_path_data_provider import (
    PointsPathDataProviderSchemaItem,
)
from pydantic import Field


class PointsPathDataProvider(ContextProvider):
    """
    Context provider for k-path configuration in band structure calculations.

    The 'point' is a high-symmetry label (e.g. "Γ", "K", "M") resolved to coordinates at render time.
    """

    name: str = Field(default="kpath")
    path: List[PointsPathDataProviderSchemaItem] = Field(default_factory=list)

    @property
    def is_edited_key(self) -> str:
        return "isKpathEdited"

    @property
    def default_data(self) -> List[Dict[str, Any]]:
        return [item.model_dump(exclude_none=True) for item in self.path]
