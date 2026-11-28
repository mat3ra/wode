import json
import os
from typing import Any, Dict

import pytest
from mat3ra.made.material import Material
from mat3ra.standata.applications import ApplicationStandata
from mat3ra.standata.subworkflows import SubworkflowStandata
from mat3ra.standata.workflows import WorkflowStandata
from mat3ra.wode import Subworkflow, Unit, Workflow
from mat3ra.wode.workflows.workflow import (
    apply_planewave_cutoffs,
    apply_scf_kgrid,
    get_kgrid_of_job,
    get_kgrid_query,
    patch_workflow_qe_input,
    set_assignment_value,
)

WORKFLOW_HASHES_PATH = os.path.join(os.path.dirname(__file__), "../fixtures/workflow_hashes.json")

BAND_GAP_WORKFLOW_NAME = "Band Gap"

WORKFLOW_STANDATA = WorkflowStandata()
SUBWORKFLOW_STANDATA = SubworkflowStandata()
APPLICATION_STANDATA = ApplicationStandata()

WORKFLOW_NAME = WORKFLOW_STANDATA.get_by_name_first_match("band_gap")["name"]
SUBWORKFLOW_NAME = SUBWORKFLOW_STANDATA.get_by_name_first_match("pw_scf")["name"]
DEFAULT_WF_NAME = WORKFLOW_STANDATA.get_default()["name"]

APPLICATION_ESPRESSO = APPLICATION_STANDATA.get_by_name_first_match("espresso")["name"]
APPLICATION_VASP = APPLICATION_STANDATA.get_by_name_first_match("vasp")["name"]
APPLICATION_PYTHON = APPLICATION_STANDATA.get_by_name_first_match("python")["name"]
RELAXATION_NAME = SUBWORKFLOW_STANDATA.get_relaxation_by_application(APPLICATION_ESPRESSO)["name"]

UNIT_CONFIG = {
    "type": "execution",
    "name": "pw_scf",
    "flowchartId": "unit-flowchart-id",
    "head": True,
}

BAND_STRUCTURE_SEARCH_NAME = "band_structure"
BAND_GAP_SEARCH_NAME = "espresso/band_gap\\.json$"
TOTAL_ENERGY_SEARCH_NAME = "total_energy"

EXPECTED_MODEL_FUNCTIONAL = "pbe"
EXECUTION_UNIT_TYPE = "execution"
CONTEXT_ITEM_REQUIRED_KEYS = ("name", "isEdited", "data", "extraData")

WEBAPP_COMPATIBLE_WORKFLOW_SEARCH_NAMES = [
    BAND_STRUCTURE_SEARCH_NAME,
    BAND_GAP_SEARCH_NAME,
    TOTAL_ENERGY_SEARCH_NAME,
]


def test_creation():
    wf = Workflow(name=WORKFLOW_NAME)
    assert wf.name == WORKFLOW_NAME


def test_subworkflows():
    sw = Subworkflow(name=SUBWORKFLOW_NAME)
    wf = Workflow(name=WORKFLOW_NAME, subworkflows=[sw])
    assert len(wf.subworkflows) == 1
    assert wf.subworkflows[0].name == SUBWORKFLOW_NAME


def test_with_units():
    unit = Unit(**UNIT_CONFIG)
    wf = Workflow(name=WORKFLOW_NAME, units=[unit])
    assert len(wf.units) == 1
    assert wf.units[0].name == UNIT_CONFIG["name"]


def test_id_generation():
    wf1 = Workflow(name=WORKFLOW_NAME)
    wf2 = Workflow(name=WORKFLOW_NAME)
    assert wf1.id != wf2.id


def test_to_dict():
    wf = Workflow(name=WORKFLOW_NAME)
    data = wf.to_dict()
    assert data["name"] == WORKFLOW_NAME


def test_add_subworkflow():
    wf = Workflow(name=WORKFLOW_NAME)
    sw = Subworkflow(name=SUBWORKFLOW_NAME)
    wf.add_subworkflow(sw)
    assert len(wf.subworkflows) == 1
    assert wf.subworkflows[0].name == SUBWORKFLOW_NAME
    assert len(wf.units) == 1
    assert wf.units[0].name == SUBWORKFLOW_NAME
    assert wf.units[0].type == "subworkflow"


@pytest.mark.parametrize(
    "application,has_relaxation",
    [
        (APPLICATION_ESPRESSO, True),
        (APPLICATION_VASP, True),
        (APPLICATION_PYTHON, False),
    ],
)
def test_get_relaxation_subworkflow(application, has_relaxation):
    workflows = WORKFLOW_STANDATA.get_by_categories(application, DEFAULT_WF_NAME)
    if not workflows:
        pytest.skip(f"No {DEFAULT_WF_NAME} workflow found for {application}")

    workflow_config = workflows[0]
    wf = Workflow(**workflow_config)

    result = wf.relaxation_subworkflow
    if has_relaxation:
        assert result is not None
        assert result.name == RELAXATION_NAME
        assert hasattr(result, "name")
    else:
        assert result is None


@pytest.mark.parametrize(
    "application",
    [APPLICATION_ESPRESSO, APPLICATION_VASP],
)
def test_add_relaxation(application):
    workflows = WORKFLOW_STANDATA.get_by_categories(application, DEFAULT_WF_NAME)
    if not workflows:
        pytest.skip(f"No {DEFAULT_WF_NAME} workflow found for {application}")

    workflow_config = workflows[0]
    wf = Workflow(**workflow_config)

    initial_subworkflow_count = len(wf.subworkflows)
    assert not wf.has_relaxation

    wf.add_relaxation()

    assert wf.has_relaxation
    assert len(wf.subworkflows) == initial_subworkflow_count + 1
    assert wf.subworkflows[0].name == wf.relaxation_subworkflow.name


@pytest.mark.parametrize(
    "application",
    [APPLICATION_ESPRESSO, APPLICATION_VASP],
)
def test_remove_relaxation(application):
    workflows = WORKFLOW_STANDATA.get_by_categories(application, DEFAULT_WF_NAME)
    if not workflows:
        pytest.skip(f"No {DEFAULT_WF_NAME} workflow found for {application}")

    workflow_config = workflows[0]
    wf = Workflow(**workflow_config)

    wf.add_relaxation()
    assert wf.has_relaxation
    initial_subworkflow_count = len(wf.subworkflows)

    wf.remove_relaxation()

    assert not wf.has_relaxation
    assert len(wf.subworkflows) == initial_subworkflow_count - 1


@pytest.mark.parametrize(
    "method",
    [
        "only_new_unit",
        "with_unit_instance",
        "with_flowchart_id",
    ],
)
def test_set_unit(method):
    workflows = WORKFLOW_STANDATA.get_by_categories(APPLICATION_ESPRESSO, DEFAULT_WF_NAME)
    if not workflows:
        pytest.skip(f"No {DEFAULT_WF_NAME} workflow found for {APPLICATION_ESPRESSO}")

    workflow_config = workflows[0]
    wf = Workflow(**workflow_config)

    wf.add_relaxation()

    relaxation_subworkflow = wf._find_relaxation_subworkflow()
    assert relaxation_subworkflow is not None

    unit_to_modify = relaxation_subworkflow.get_unit_by_name(name_regex="relax")
    assert unit_to_modify is not None

    unit_to_modify.add_context({"name": "test_key", "data": "test_value"})
    unit_to_modify.add_context({"name": "another_key", "data": 42})

    if method == "only_new_unit":
        success = relaxation_subworkflow.set_unit(unit_to_modify)
    elif method == "with_unit_instance":
        original_unit = relaxation_subworkflow.get_unit_by_name(name_regex="relax")
        success = relaxation_subworkflow.set_unit(unit_to_modify, unit=original_unit)
    elif method == "with_flowchart_id":
        flowchart_id = unit_to_modify.flowchartId
        success = relaxation_subworkflow.set_unit(unit_to_modify, unit_flowchart_id=flowchart_id)

    assert success is True

    updated_unit = relaxation_subworkflow.get_unit_by_name(name_regex="relax")
    assert updated_unit.get_context_item_data("test_key") == "test_value"
    assert updated_unit.get_context_item_data("another_key") == 42


@pytest.mark.parametrize("workflow, app", [("band_gap", "espresso")])
def test_calculate_hash(workflow, app):
    with open(WORKFLOW_HASHES_PATH, "r") as f:
        expected_hashes = json.load(f)

    workflow_data = expected_hashes.get(app, {}).get(workflow, {})
    expected_hash = workflow_data.get("hash")

    workflows = WORKFLOW_STANDATA.get_by_categories(app, workflow)
    fixture = next(w for w in workflows if w["name"] == BAND_GAP_WORKFLOW_NAME)
    wf = Workflow(**{k: v for k, v in fixture.items() if k != "hash"})
    assert wf.hash == expected_hash


FIXED_CELL_RELAXATION = "fixed_cell_relaxation.json"
RELAX_UNIT_NAMES = ["pw_relax"]
SURFACE_ENERGY_WORKFLOW = "surface_energy.json"
SCF_KGRID = [4, 4, 1]


def _relax_workflow():
    config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match(FIXED_CELL_RELAXATION)
    return Workflow.create(config)


def _pw_relax_content(workflow):
    return workflow.subworkflows[0].get_unit_by_name(name="pw_relax").input[0].template.content


@pytest.mark.parametrize(
    "parameters,present,absent,error",
    [
        (
            {"system": {"vdw_corr": "d3_grimme"}, "electrons": {"mixing_beta": 0.5, "diago_full_acc": True}},
            ["vdw_corr = 'd3_grimme'", "{{ input.IBRAV }}", "mixing_beta = 0.5", "diago_full_acc = .true."],
            ["mixing_beta = 0.3"],
            None,
        ),
        ({"FAKESECTION": {"x": 1}}, [], [], "Namelist '&FAKESECTION' not found."),
    ],
)
def test_patch_workflow_qe_input(parameters, present, absent, error):
    workflow = _relax_workflow()
    if error:
        with pytest.raises(ValueError, match=error):
            patch_workflow_qe_input(workflow, parameters, unit_names=RELAX_UNIT_NAMES)
        return
    patch_workflow_qe_input(workflow, parameters, unit_names=RELAX_UNIT_NAMES)
    content = _pw_relax_content(workflow)
    for text in present:
        assert text in content
    for text in absent:
        assert text not in content


def _surface_workflow():
    config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match(SURFACE_ENERGY_WORKFLOW)
    return Workflow.create(config)


def _material_stub(number_of_atoms=2, reciprocal_vector_ratios=[1.0, 1.0, 0.5]):
    """A real `Material` whose orthorhombic lattice yields the requested ratios."""
    a, b, c = (2.0 / ratio for ratio in reciprocal_vector_ratios)
    return Material.create(
        {
            "name": "test",
            "lattice": {
                "a": a,
                "b": b,
                "c": c,
                "alpha": 90,
                "beta": 90,
                "gamma": 90,
                "type": "ORC",
                "units": {"length": "angstrom", "angle": "degree"},
            },
            "basis": {
                "elements": [{"id": i, "value": "Si"} for i in range(number_of_atoms)],
                "coordinates": [{"id": i, "value": [i * 0.1] * 3} for i in range(number_of_atoms)],
                "units": "crystal",
            },
        }
    )


def test_apply_scf_kgrid_updates_pw_scf_context():
    workflow = _surface_workflow()
    apply_scf_kgrid(workflow, scf_kgrid=SCF_KGRID, first_only=True, material=_material_stub())
    unit = next(
        subworkflow.get_unit_by_name(name="pw_scf")
        for subworkflow in workflow.subworkflows
        if subworkflow.get_unit_by_name(name="pw_scf")
    )
    kgrid_item = next(item for item in unit.context if item.get("name") == "kgrid")
    assert kgrid_item["data"]["dimensions"] == SCF_KGRID
    # KPPRA is per reciprocal atom, and the ratios come from the lattice -- both via `material`.
    assert kgrid_item["data"]["gridMetricValue"] == 4 * 4 * 1 * 2
    assert kgrid_item["data"]["reciprocalVectorRatios"] == [1.0, 1.0, 0.5]


@pytest.mark.parametrize("wavefunction,density", [(40, 200), (60, 480)])
def test_apply_planewave_cutoffs_updates_pw_relax_context(wavefunction, density):
    workflow = _relax_workflow()
    apply_planewave_cutoffs(workflow, wavefunction, density, unit_name="pw_relax")
    unit = workflow.subworkflows[0].get_unit_by_name(name="pw_relax")
    cutoffs_item = next(item for item in unit.context if item.get("name") == "cutoffs")
    assert cutoffs_item["data"]["wavefunction"] == float(wavefunction)
    assert cutoffs_item["data"]["density"] == float(density)


def test_set_assignment_value_sets_every_unit_of_that_name():
    config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match(SURFACE_ENERGY_WORKFLOW)
    workflow = set_assignment_value(Workflow.create(config), "assign-bulk-id", "'bulk-1'")
    units = [
        subworkflow.get_unit_by_name(name="assign-bulk-id")
        for subworkflow in workflow.subworkflows
        if subworkflow.get_unit_by_name(name="assign-bulk-id")
    ]
    assert units
    assert all(unit.value == "'bulk-1'" for unit in units)


def test_set_assignment_value_raises_for_an_unknown_unit():
    with pytest.raises(ValueError, match="no 'assign-nothing' unit"):
        set_assignment_value(_relax_workflow(), "assign-nothing", "1")


SCF_KGRID_QUERY: Dict[str, Any] = {
    "workflow.subworkflows.units": {
        "$elemMatch": {"name": "pw_scf", "context": {"$elemMatch": {"name": "kgrid", "data.dimensions": [4, 4, 4]}}}
    }
}
RELAX_KGRID_QUERY: Dict[str, Any] = {
    "workflow.subworkflows.units": {
        "$elemMatch": {"name": "pw_relax", "context": {"$elemMatch": {"name": "kgrid", "data.dimensions": [4, 4, 4]}}}
    }
}


@pytest.mark.parametrize(
    ("kgrid", "unit_name", "expected_query"),
    [(None, "pw_relax", {}), ([4, 4, 4], "pw_scf", SCF_KGRID_QUERY), ([4, 4, 4], "pw_relax", RELAX_KGRID_QUERY)],
)
def test_get_kgrid_query(kgrid, unit_name, expected_query):
    assert get_kgrid_query(kgrid, unit_name) == expected_query


# The pw_scf unit with a kgrid context, input not rendered yet, and as production job BLmZo5WZfFXKKTb2H stores a job
# created without a grid: no context, the platform's grid rendered into the input.
KGRID_CONTEXT: Dict[str, Any] = {
    "name": "kgrid",
    "isEdited": True,
    "data": {"dimensions": [4, 4, 4], "shifts": [0, 0, 0], "gridMetricType": "KPPRA", "gridMetricValue": 768},
    "extraData": {"materialHash": "041d30e32f91e2eeb14c74298dffd08b"},
}
RENDERED_INPUT = (
    "CELL_PARAMETERS angstrom\n   0.000000000    0.000000000    5.326038000\nK_POINTS automatic\n1 1 1 0 0 0 \n"
)
UNIT_WITH_KGRID_CONTEXT: Dict[str, Any] = {
    "name": "pw_scf",
    "context": [KGRID_CONTEXT],
    "input": [{"template": {"name": "pw_scf.in"}, "rendered": "", "isManuallyChanged": False}],
}
UNIT_WITH_RENDERED_INPUT: Dict[str, Any] = {
    "name": "pw_scf",
    "context": [],
    "input": [{"template": {"name": "pw_scf.in"}, "rendered": RENDERED_INPUT, "isManuallyChanged": False}],
}


@pytest.mark.parametrize(
    ("unit", "expected_kgrid"),
    [(UNIT_WITH_KGRID_CONTEXT, [4, 4, 4]), (UNIT_WITH_RENDERED_INPUT, [1, 1, 1])],
)
def test_get_kgrid_of_job(unit, expected_kgrid):
    assert get_kgrid_of_job({"workflow": {"subworkflows": [{"units": [unit]}]}}) == expected_kgrid
