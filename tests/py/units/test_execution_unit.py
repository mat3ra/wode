import copy

import pytest
from fixtures import get_execution_unit_config_by_application_workflow_unit
from mat3ra.wode.units.execution import ExecutionUnit, set_execution_unit_input

UNIT_CONFIG = {
    **get_execution_unit_config_by_application_workflow_unit("espresso", "total_energy", "pw_scf"),
    "flowchartId": "abc-123",
    "head": True,
}

CONTENT_INCAR = "ENCUT = 500\nISMEAR = 1\n"
CONTENT_POTCAR = "PAW_PBE Fe\n"

PATTERN_ENCUT = r"ENCUT\s*=\s*[\d.]+"
REPLACEMENT_ENCUT = "ENCUT = {% raw %}{{ encut }}{% endraw %}"


def _make_template(name: str, content: str) -> dict:
    return {
        "name": name,
        "content": content,
        "applicationName": "vasp",
        "applicationVersion": "*",
        "executableName": "vasp",
        "contextProviders": [],
    }


def _make_input_item(name: str, content: str) -> dict:
    return {
        "template": _make_template(name, content),
        "rendered": content,
        "isManuallyChanged": False,
    }


INPUT_INCAR = _make_input_item("INCAR", CONTENT_INCAR)
INPUT_POTCAR = _make_input_item("POTCAR", CONTENT_POTCAR)


def _make_unit(*input_items):
    return ExecutionUnit(**{**UNIT_CONFIG, "input": copy.deepcopy(list(input_items))})


def test_replace_in_input_content_all_inputs():
    unit = _make_unit(INPUT_INCAR)
    unit.replace_in_input_content(PATTERN_ENCUT, REPLACEMENT_ENCUT)
    assert REPLACEMENT_ENCUT in unit.input[0].template.content


@pytest.mark.parametrize(
    "target_name, incar_changed, potcar_changed",
    [
        ("INCAR", True, False),
        ("POTCAR", False, False),
        (None, True, False),
    ],
)
def test_replace_in_input_content_filtered_by_name(target_name, incar_changed, potcar_changed):
    unit = _make_unit(INPUT_INCAR, INPUT_POTCAR)
    unit.replace_in_input_content(PATTERN_ENCUT, REPLACEMENT_ENCUT, input_name=target_name)
    assert (REPLACEMENT_ENCUT in unit.input[0].template.content) == incar_changed
    assert (REPLACEMENT_ENCUT in unit.input[1].template.content) == potcar_changed


def _unit():
    return {
        "name": "custom_script",
        "input": [
            {"template": {"name": "script.py", "content": "original"}},
            {"template": {"name": "requirements.txt", "content": ""}},
        ],
    }


def test_replaces_the_named_input_and_marks_it_manually_changed():
    """isManuallyChanged is what stops the platform re-rendering the runner's placeholders."""
    unit = _unit()
    set_execution_unit_input(unit, "requirements.txt", "numpy<2\n")

    changed = unit["input"][1]
    assert changed["template"]["content"] == "numpy<2\n"
    assert changed["rendered"] == "numpy<2\n"
    assert changed["isManuallyChanged"] is True
    assert unit["input"][0]["template"]["content"] == "original", "other inputs are untouched"


def test_matches_by_name_not_position():
    """A flavor may list its inputs in any order; position would write into the wrong file."""
    unit = _unit()
    unit["input"].reverse()
    set_execution_unit_input(unit, "script.py", "print(1)")

    by_name = {item["template"]["name"]: item for item in unit["input"]}
    assert by_name["script.py"]["rendered"] == "print(1)"
    assert "rendered" not in by_name["requirements.txt"]


def test_unknown_input_name_is_an_error_naming_what_is_available():
    with pytest.raises(KeyError, match="requirements.txt"):
        set_execution_unit_input(_unit(), "nope.txt", "x")
