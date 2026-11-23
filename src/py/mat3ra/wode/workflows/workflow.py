import re
from typing import Any, Dict, List, Optional

from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.workflow import WorkflowSchema
from mat3ra.made.material import Material
from mat3ra.prode import PropertyName
from mat3ra.standata.subworkflows import SubworkflowStandata
from mat3ra.utils.uuid import get_uuid
from pydantic import Field

from ..context.providers import PlanewaveCutoffsContextProvider, PointsGridDataProvider
from ..mixins import FlowchartUnitsManager
from ..subworkflows import Subworkflow
from ..units import Unit


class Workflow(WorkflowSchema, HashedEntityMixin, InMemoryEntitySnakeCase, FlowchartUnitsManager[Unit]):
    """
    Workflow class representing a complete workflow configuration.

    Attributes:
        name: Name of the workflow
        subworkflows: List of subworkflows in the workflow
        units: List of units linking the subworkflows
        properties: List of properties extracted by the workflow
    """

    id: str = Field(default_factory=get_uuid, alias="_id")
    workflows: List[Dict[str, Any]] = Field(default_factory=list)
    properties: List[str] = Field(default_factory=list)
    subworkflows: List[Subworkflow] = Field(default_factory=list)
    units: List[Unit] = Field(default_factory=list)
    isMultiMaterial: bool = Field(default=False)

    @property
    def relaxation_subworkflow(self) -> Optional[Subworkflow]:
        application = self.application or (self.subworkflows[0].application if self.subworkflows else None)
        application_name = (
            application.get("name") if isinstance(application, dict) else (application.name if application else None)
        )
        if application_name is None:
            return None
        subworkflow_standata = SubworkflowStandata()
        relaxation_data = subworkflow_standata.get_relaxation_by_application(application_name)
        return Subworkflow(**relaxation_data) if relaxation_data else None

    @property
    def has_relaxation(self) -> bool:
        return self._find_relaxation_subworkflow() is not None

    def render(self, external_context: Dict[str, Any]) -> None:
        """Render inputs for a material; workflow execution belongs to the job runtime."""
        context = {**external_context, "workflowHasRelaxation": self.has_relaxation}
        for subworkflow in self.subworkflows:
            subworkflow.render(context)
        for index, definition in enumerate(self.workflows):
            workflow = Workflow(**definition)
            workflow.render(external_context)
            self.workflows[index] = workflow.to_dict()

    def add_subworkflow(self, subworkflow: Subworkflow, head: bool = False, index: int = -1):
        self._add_to_list(self.subworkflows, subworkflow, head, index)
        unit = subworkflow.get_as_unit()
        self.add_unit(unit, head, index)

    def remove_subworkflow_by_id(self, id: str):
        self.subworkflows = [sw for sw in self.subworkflows if sw.id != id]

    def find_subworkflow_by_id(self, id: str) -> Optional[Subworkflow]:
        return next((sw for sw in self.subworkflows if sw.id == id), None)

    def set_context_to_unit(
        self,
        unit_name: Optional[str] = None,
        unit_name_regex: Optional[str] = None,
        new_context: Optional[Dict[str, Any]] = None,
    ):
        target_unit = self.get_unit_by_name(name=unit_name, name_regex=unit_name_regex)
        target_unit.set_context(new_context or [])

    def _find_relaxation_subworkflow(self) -> Optional[Subworkflow]:
        relaxation = self.relaxation_subworkflow
        if relaxation is None:
            return None
        target_name = relaxation.name

        return next(
            (swf for swf in self.subworkflows if swf.name == target_name),
            None,
        )

    def add_relaxation(self) -> None:
        if self.has_relaxation:
            return

        relaxation_definition = self.relaxation_subworkflow
        if relaxation_definition is not None:
            self.add_subworkflow(relaxation_definition, head=True)

    def get_hash_object(self) -> Dict[str, Any]:
        nested_workflows = getattr(self, "workflows", []) or []
        return {
            "units": ",".join(u.calculate_hash() for u in self.units),
            "subworkflows": ",".join(sw.calculate_hash() for sw in self.subworkflows),
            "workflows": ",".join(w.calculate_hash() for w in nested_workflows),
        }

    def remove_relaxation(self) -> None:
        existing = self._find_relaxation_subworkflow()
        if existing is not None:
            self.remove_subworkflow_by_id(existing.id)

    def to_dict_without_special_keys(self, special_keys=["context"]) -> Dict[str, Any]:
        workflow_dict = self.to_dict()
        for swf in workflow_dict.get("subworkflows", []):
            for unit in swf.get("units", []):
                for key in special_keys:
                    if key in unit:
                        unit[key] = []
        return workflow_dict


FORTRAN_NUMBER_PATTERN = re.compile(r"^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[de][+-]?\d+)?$", re.IGNORECASE)


def _format_fortran_value(value: object) -> str:
    if isinstance(value, bool):
        return f".{str(value).lower()}."
    if isinstance(value, str) and not FORTRAN_NUMBER_PATTERN.match(value):
        return repr(value)
    return str(value)


def patch_workflow_qe_input(
    workflow: Workflow,
    parameters: Dict[str, Dict[str, object]],
    unit_names: List[str],
    input_name: Optional[str] = None,
) -> Workflow:
    """
    Patch QE inputs across workflow subworkflows for named units.

    Args:
        workflow: Workflow with subworkflows.
        parameters: Multi-section parameters {section: {key: val}}.
        unit_names: List of unit names to patch.
        input_name: Optional input file name filter.

    Example:
        patch_workflow_qe_input(workflow, {"system": {"vdw_corr": "d3_grimme"}}, ["pw_relax"])
    """
    for subworkflow in workflow.subworkflows:
        for unit_name in unit_names:
            if not (unit := subworkflow.get_unit_by_name(name=unit_name)):
                continue
            for input_item in getattr(unit, "input", []):
                template = input_item.template
                template_name = template.name
                content = template.content

                if input_name not in (None, template_name):
                    continue

                for section, updates in parameters.items():
                    name = section.lstrip("&")
                    match = re.search(rf"(?ims)(^&{re.escape(name)}\s*\n)(.*?)(^/\s*$)", content)
                    if not match:
                        raise ValueError(f"Namelist '&{name.upper()}' not found.")
                    header, body, footer = match.groups()
                    for key, value in updates.items():
                        line = f"    {key} = {_format_fortran_value(value)}"
                        pattern = rf"(?im)^\s*{re.escape(key)}\s*=.*$"
                        body = re.sub(pattern, line, body) if re.search(pattern, body) else f"{body.rstrip()}\n{line}\n"
                    content = content[: match.start()] + header + body + footer + content[match.end() :]

                template.set_content(content)
            subworkflow.set_unit(unit)
    return workflow


def apply_scf_kgrid(
    workflow: Workflow,
    scf_kgrid=None,
    *,
    material: Optional[Material] = None,
    unit_name: str = "pw_scf",
    first_only: bool = False,
) -> Workflow:
    """
    Attaches an edited SCF k-grid context to units named `unit_name`.

    Args:
        workflow: Workflow with subworkflows.
        scf_kgrid: K-grid dimensions, e.g. [4, 4, 1]. If None, the workflow is returned unchanged.
        material: Material the grid applies to. KPPRA is per reciprocal atom and the reciprocal
            vector ratios come from the lattice, so both are derived from it.
        unit_name: Name of the unit to attach the k-grid context to.
        first_only: If True, only patch the first matching subworkflow.
    """
    if scf_kgrid is None:
        return workflow
    context = PointsGridDataProvider(material=material, dimensions=scf_kgrid, isEdited=True).get_context_item_data()
    for subworkflow in workflow.subworkflows:
        if unit_name not in [unit.name for unit in subworkflow.units]:
            continue
        unit = subworkflow.get_unit_by_name(name=unit_name)
        unit.add_context(context)
        subworkflow.set_unit(unit)
        if first_only:
            break
    return workflow


def set_assignment_value(workflow: Workflow, unit_name: str, value: str) -> Workflow:
    """
    Sets the value of the assignment units named `unit_name` in every subworkflow that has one.

    Args:
        workflow: Workflow with subworkflows.
        unit_name: Name of the assignment unit, e.g. "assign-charge".
        value: The unit's new value, as the Python expression the workflow evaluates, e.g. "-1".

    Raises:
        ValueError: If no subworkflow has a unit of that name.
    """
    subworkflows = [
        subworkflow for subworkflow in workflow.subworkflows if subworkflow.get_unit_by_name(name=unit_name)
    ]
    if not subworkflows:
        raise ValueError(f"The workflow has no '{unit_name}' unit.")
    for subworkflow in subworkflows:
        unit = subworkflow.get_unit_by_name(name=unit_name)
        unit.value = value
        subworkflow.set_unit(unit)
    return workflow


def apply_planewave_cutoffs(workflow: Workflow, wavefunction, density, *, unit_name: str = "pw_relax") -> Workflow:
    """Attaches an edited planewave cutoffs context to units named `unit_name`."""
    context = PlanewaveCutoffsContextProvider(
        wavefunction=wavefunction, density=density, isEdited=True
    ).get_context_item_data()
    for subworkflow in workflow.subworkflows:
        if unit_name not in [unit.name for unit in subworkflow.units]:
            continue
        unit = subworkflow.get_unit_by_name(name=unit_name)
        unit.add_context(context)
        subworkflow.set_unit(unit)
    return workflow


def get_kgrid_query(kgrid: Optional[List[int]], unit_name: str = "pw_scf") -> Dict[str, Any]:
    """
    `jobs.list` condition for jobs whose `unit_name` unit ran on `kgrid` (empty when `kgrid` is None), matched where
    `apply_scf_kgrid` sets it: `workflow.subworkflows[].units[name].context[name="kgrid"].data.dimensions`.
    A job created without an explicit k-grid has no such context and never matches.
    """
    if kgrid is None:
        return {}
    kgrid_context = {"$elemMatch": {"name": "kgrid", "data.dimensions": list(kgrid)}}
    return {"workflow.subworkflows.units": {"$elemMatch": {"name": unit_name, "context": kgrid_context}}}


def get_kgrid_of_job(job: Dict[str, Any], unit_name: str = "pw_scf") -> Optional[List[int]]:
    """
    K-grid dimensions the job's `unit_name` unit ran on: its `kgrid` context, or, for a job created without one, the
    grid the platform rendered into the unit's input, `workflow.subworkflows[].units[name].input[0].rendered`.
    """
    units = [unit for subworkflow in job["workflow"]["subworkflows"] for unit in subworkflow["units"]]
    unit = next(unit for unit in units if unit["name"] == unit_name)
    kgrid_context = next((item for item in unit["context"] if item["name"] == "kgrid"), None)
    if kgrid_context:
        return kgrid_context["data"]["dimensions"]
    match = re.search(r"K_POINTS automatic\s+(\d+)\s+(\d+)\s+(\d+)", unit["input"][0]["rendered"])
    return [int(dimension) for dimension in match.groups()] if match else None


def get_fermi_energy_flowchart_id(job: dict) -> Optional[str]:
    """
    Find the flowchart ID of the last unit that declares fermi_energy in its results.
    Mirrors calculateFermiEnergy logic in the web app.
    """
    for subworkflow in job.get("workflow", {}).get("subworkflows", []):
        units_with_fermi_energy = [
            unit
            for unit in subworkflow.get("units", [])
            if any(r.get("name") == PropertyName.scalar.fermi_energy.value for r in unit.get("results", []))
        ]
        if not units_with_fermi_energy:
            continue
        return units_with_fermi_energy[-1].get("flowchartId")
    return None
