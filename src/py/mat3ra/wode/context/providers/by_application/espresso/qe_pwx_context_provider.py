from pathlib import PurePosixPath
from typing import Any, Dict

from mat3ra.esse.models.context_providers_directory.by_application.qe_pwx_context_provider import (
    QEPwxContextProviderSchema,
)
from mat3ra.periodic_table.helpers import get_atomic_mass_from_element

from ..executable_context_provider import ExecutableContextProvider


class QEPWXContextProvider(QEPwxContextProviderSchema, ExecutableContextProvider):
    """
    Context provider for Quantum ESPRESSO pw.x settings.
    """

    name: str = "input"

    @classmethod
    def from_context(cls, external_context: Dict[str, Any], data: Dict[str, Any]) -> "QEPWXContextProvider":
        """Build primary and per-material SCF input using the same geometry conversion."""
        materials = external_context.get("materials") or [external_context["material"]]
        common_data = {key: value for key, value in data.items() if key != "perMaterial"}
        per_material = [
            cls(**{**cls._build_input(material, external_context), **common_data}).default_data
            for material in materials
        ]
        return cls(
            **{
                **cls._build_input(external_context["material"], external_context),
                "perMaterial": per_material,
                **data,
            }
        )

    @staticmethod
    def _build_input(material, external_context: Dict[str, Any]) -> Dict[str, Any]:
        material = material.model_copy(deep=True)
        if material.lattice.units.length.value != "angstrom":
            raise ValueError("QE input rendering requires lattice lengths in angstrom")
        material.to_crystal()
        basis = material.basis
        # STANDATA's SCF templates use Nunjucks loop assignment for constraints,
        # which does not have the same scope in Jinja. Do not silently drop them.
        if any(not all(value) for value in basis.constraints.values) or any(basis.labels.values):
            raise NotImplementedError("Python QE rendering does not yet support constraints or atom labels")
        pseudopotentials = {
            item["element"]: item for item in (external_context.get("methodData") or {}).get("pseudo", [])
        }
        species = []
        for element in dict.fromkeys(basis.elements.values):
            pseudopotential = pseudopotentials.get(element, {})
            filename = pseudopotential.get("filename") or PurePosixPath(pseudopotential.get("path", "")).name
            if not filename:
                raise ValueError(f"Missing pseudopotential for {element}")
            species.append({"X": element, "Mass_X": get_atomic_mass_from_element(element), "PseudoPot_X": filename})
        coordinates = dict(zip(basis.coordinates.ids, basis.coordinates.values))
        positions = [
            {
                "X": element,
                "x": coordinates[identifier][0],
                "y": coordinates[identifier][1],
                "z": coordinates[identifier][2],
                "if_pos(1)": 1,
                "if_pos(2)": 1,
                "if_pos(3)": 1,
            }
            for identifier, element in zip(basis.elements.ids, basis.elements.values)
        ]
        return {
            "IBRAV": 0,
            "RESTART_MODE": "restart"
            if external_context.get("jobHasParent") or external_context.get("workflowHasRelaxation")
            else "from_scratch",
            "NAT": len(positions),
            "NTYP": len(species),
            "NTYP_WITH_LABELS": len(species),
            "ATOMIC_SPECIES": species,
            "ATOMIC_SPECIES_WITH_LABELS": species,
            "ATOMIC_POSITIONS": positions,
            "ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS": "\n".join(
                f"{position['X']} {position['x']} {position['y']} {position['z']}" for position in positions
            ),
            "CELL_PARAMETERS": dict(zip(("v1", "v2", "v3"), material.lattice.vector_arrays)),
            "contextProviderName": "qe-pwx",
        }

    @property
    def default_data(self) -> Dict[str, Any]:
        fields = set(QEPwxContextProviderSchema.model_fields) | set(self.model_extra or {})
        return self.model_dump(mode="json", by_alias=True, include=fields)
