import json
import os

import pytest
from mat3ra.standata.applications import ApplicationStandata
from mat3ra.standata.subworkflows import SubworkflowStandata
from mat3ra.standata.workflows import WorkflowStandata

from mat3ra.wode import Subworkflow, Unit, Workflow

WORKFLOW_HASHES_PATH = os.path.join(os.path.dirname(__file__), "../fixtures/workflow_hashes.json")

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

    unit_to_modify = wf.get_unit_by_name(name_regex="relax")
    assert unit_to_modify is not None

    new_context = {"test_key": "test_value", "another_key": 42}
    unit_to_modify.add_context(new_context)

    if method == "only_new_unit":
        success = wf.set_unit(unit_to_modify)
    elif method == "with_unit_instance":
        original_unit = wf.get_unit_by_name(name_regex="relax")
        success = wf.set_unit(unit_to_modify, unit=original_unit)
    elif method == "with_flowchart_id":
        flowchart_id = unit_to_modify.flowchartId
        success = wf.set_unit(unit_to_modify, unit_flowchart_id=flowchart_id)

    assert success is True

    updated_unit = wf.get_unit_by_name(name_regex="relax")
    assert "test_key" in updated_unit.context
    assert "another_key" in updated_unit.context
    assert updated_unit.context["test_key"] == "test_value"
    assert updated_unit.context["another_key"] == 42


@pytest.mark.parametrize("workflow, app", [("band_gap", "espresso")])
def test_calculate_hash(workflow, app):
    fixture = WorkflowStandata.get_by_name_and_categories(workflow, app)

    with open(WORKFLOW_HASHES_PATH, "r") as f:
        expected_hashes = json.load(f)
    expected_hash = expected_hashes.get(app, {}).get(workflow)

    wf = Workflow(**{k: v for k, v in fixture.items() if k != "hash"})
    assert wf.hash == expected_hash
