from copy import deepcopy

import pytest
from jinja2 import TemplateError
from mat3ra.made.material import Material, defaultMaterialConfig
from mat3ra.standata.workflows import WorkflowStandata
from mat3ra.wode.units.unit import Unit
from mat3ra.wode.workflows.workflow import Workflow


@pytest.fixture
def material():
    return Material.create(defaultMaterialConfig)


@pytest.fixture
def workflow():
    definition = deepcopy(WorkflowStandata.find_by_application_and_name("espresso", "Total Energy"))
    method = definition["subworkflows"][0]["model"]["method"]
    method["subtype"] = "paw"
    method["data"]["pseudo"] = [{"element": "Si", "path": "$PSEUDO_DIRECTORY/Si.upf"}]
    workflow = Workflow(**definition)
    unit = workflow.subworkflows[0].units[0]
    unit.add_context({"name": "cutoffs", "data": {"wavefunction": 24, "density": 192}})
    unit.add_context({"name": "kgrid", "data": {"dimensions": [4, 4, 4]}})
    return workflow


def test_render_standata_input_without_changing_material_or_template(workflow, material):
    original_material = material.to_dict()
    item = workflow.subworkflows[0].units[0].input[0]
    template = item.template.to_dict()
    workflow.render({"material": material})
    assert "Si 28.085000 Si.upf" in item.rendered
    assert "Si     0.250000000    0.250000000    0.250000000" in item.rendered
    assert "ecutwfc = 24" in item.rendered
    assert "ecutrho = 192" in item.rendered
    assert "4 4 4 0 0 0" in item.rendered
    assert "{{ JOB_WORK_DIR }}" in item.rendered
    assert "restart_mode = 'from_scratch'" in item.rendered
    first_render = item.rendered
    workflow.render({"material": material})
    assert item.rendered == first_render
    assert material.to_dict() == original_material
    assert item.template.to_dict() == template
    assert workflow.to_dict()["subworkflows"][0]["units"][0]["input"][0]["rendered"] == first_render


def test_context_overrides_and_parent_restart(workflow, material):
    unit = workflow.subworkflows[0].units[0]
    unit.add_context({"name": "cutoffs", "data": {"wavefunction": 40, "density": 320}})
    unit.add_context({"name": "input", "data": {"RESTART_MODE": "from_scratch"}})
    workflow.render({"material": material, "jobHasParent": True})
    assert "restart_mode = 'from_scratch'" in unit.input[0].rendered
    assert "ecutwfc = 40" in unit.input[0].rendered
    unit.remove_context("input")
    workflow.render({"material": material, "jobHasParent": True})
    assert "restart_mode = 'restart'" in unit.input[0].rendered


def test_manual_input_needs_no_provider(workflow):
    item = workflow.subworkflows[0].units[0].input[0]
    item.isManuallyChanged = True
    item.rendered = "user supplied input"
    workflow.render({})
    assert item.rendered == "user supplied input"


def test_unknown_provider_fails(workflow, material):
    item = workflow.subworkflows[0].units[0].input[0]
    item.template.context_providers[0].name = "UnsupportedProvider"
    with pytest.raises(NotImplementedError, match="UnsupportedProvider"):
        workflow.render({"material": material})


def test_invalid_template_raises_instead_of_serializing_error(workflow, material):
    item = workflow.subworkflows[0].units[0].input[0]
    item.template.content = "{{ input.NAT | no_such_filter }}"
    with pytest.raises(TemplateError):
        workflow.render({"material": material})


def test_nested_workflow_rendering(workflow, material):
    outer = Workflow(name="Nested", workflows=[workflow.to_dict()])
    outer.render({"material": material})
    item = outer.workflows[0]["subworkflows"][0]["units"][0]["input"][0]
    assert "Si 28.085000 Si.upf" in item["rendered"]


@pytest.mark.parametrize("indices", [("0", "1"), (0, 1)])
def test_multi_material_inputs_select_matching_geometry_and_species(workflow, material, indices):
    second_definition = material.to_dict()
    for element in second_definition["basis"]["elements"]:
        element["value"] = "Ge"
    second_definition["basis"]["coordinates"][1]["value"] = [0.375, 0.375, 0.375]
    second_material = Material.create(second_definition)
    originals = [material.to_dict(), second_material.to_dict()]
    workflow.isMultiMaterial = True
    workflow.subworkflows.append(workflow.subworkflows[0].model_copy(deep=True))
    for index, subworkflow in enumerate(workflow.subworkflows):
        subworkflow.model.method.data.pseudo.append({"element": "Ge", "filename": "Ge.upf"})
        subworkflow.units.append(
            Unit(type="assignment", name="material-index", operand="MATERIAL_INDEX", value=indices[index])
        )
        subworkflow.units[0].add_context({"name": "input", "data": {"RESTART_MODE": "restart"}})
    workflow.render({"material": second_material, "materials": [material, second_material]})
    first_input, second_input = [subworkflow.units[0].input[0].rendered for subworkflow in workflow.subworkflows]
    assert "Si.upf" in first_input and "Ge.upf" not in first_input
    assert "Ge.upf" in second_input and "Si.upf" not in second_input
    assert "Si     0.250000000    0.250000000    0.250000000" in first_input
    assert "Ge     0.375000000    0.375000000    0.375000000" in second_input
    assert all("restart_mode = 'restart'" in content for content in (first_input, second_input))
    assert originals == [material.to_dict(), second_material.to_dict()]


@pytest.mark.parametrize("index", ["2", 2])
def test_out_of_range_material_selection_fails_in_template(workflow, material, index):
    workflow.subworkflows[0].units.append(
        Unit(type="assignment", name="material-index", operand="MATERIAL_INDEX", value=index)
    )
    with pytest.raises(TemplateError):
        workflow.render({"material": material, "materials": [material, material]})


@pytest.mark.parametrize("field,value", [("constraints", [False, True, True]), ("labels", 1)])
def test_unsupported_geometry_fails(workflow, material, field, value):
    definition = material.to_dict()
    definition["basis"][field] = [{"id": 0, "value": value}]
    with pytest.raises(NotImplementedError, match="constraints or atom labels"):
        workflow.render({"material": Material.create(definition)})


def test_missing_pseudopotential_fails(workflow, material):
    workflow.subworkflows[0].model.method.data.pseudo = []
    with pytest.raises(ValueError, match="Missing pseudopotential for Si"):
        workflow.render({"material": material})


def test_cartesian_material_renders_fractional_positions_without_mutation(workflow, material):
    material.to_cartesian()
    original = material.to_dict()
    workflow.render({"material": material})
    assert "Si     0.250000000    0.250000000    0.250000000" in workflow.subworkflows[0].units[0].input[0].rendered
    assert material.to_dict() == original


def test_missing_cutoffs_fail(workflow, material):
    workflow.subworkflows[0].units[0].remove_context("cutoffs")
    with pytest.raises(ValueError, match="cutoffs"):
        workflow.render({"material": material})


def test_grid_metric_is_not_silently_ignored(workflow, material):
    workflow.subworkflows[0].units[0].add_context({"name": "kgrid", "data": {"preferGridMetric": True}})
    with pytest.raises(NotImplementedError, match="explicit k-grid"):
        workflow.render({"material": material})
