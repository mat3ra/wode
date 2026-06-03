import copy

import pytest
from mat3ra.wode.units.execution import ExecutionUnit
from fixtures import execution_unit_config

UNIT_CONFIG = {
    **execution_unit_config("espresso", "total_energy", "pw_scf"),
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
