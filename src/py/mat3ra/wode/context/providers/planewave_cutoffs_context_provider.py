from typing import Any, Dict, Optional

from mat3ra.ade.context.context_provider import ContextProvider
from mat3ra.esse.models.context_providers_directory.planewave_cutoffs_context_provider import (
    PlanewaveCutoffsContextProviderSchema,
)
from pydantic import Field


class PlanewaveCutoffsContextProvider(PlanewaveCutoffsContextProviderSchema, ContextProvider):
    name: str = Field(default="cutoffs")
    wavefunction: Optional[float] = None
    density: Optional[float] = None

    @property
    def is_edited_key(self) -> str:
        return "isCutoffsEdited"

    @property
    def default_data(self) -> Dict[str, Any]:
        return {"wavefunction": self.wavefunction, "density": self.density}
