import pytest
from mat3ra.ade import Template
from mat3ra.wode.units.execution import ExecutionUnit, ExecutionUnitInputItem

CONTENT_DEGAUSS = "degauss = 0.005\n"
CONTENT_ECUTWFC_JINJA = "ecutwfc = {{ cutoffs.wavefunction }}\n"
CONTENT_MULTI = "degauss = 0.005\necutwfc = 40\n"

RAW_SCOPE_DEGAUSS = "{% raw %}{{ degauss }}{% endraw %}"
RAW_SCOPE_ECUTWFC = "{% raw %}{{ ecutwfc }}{% endraw %}"


def _make_unit(*contents: str) -> ExecutionUnit:
    inputs = [
        ExecutionUnitInputItem(template=Template(name="pw.in", content=c), rendered=c)
        for c in contents
    ]
    return ExecutionUnit(name="pw_scf", input=inputs)


REPLACE_IN_INPUT_CONTENT_CASES = [
    pytest.param(
        [CONTENT_DEGAUSS],
        r"degauss\s*=\s*[\d.e+\-]+",
        f"degauss = {RAW_SCOPE_DEGAUSS}",
        [f"degauss = {RAW_SCOPE_DEGAUSS}\n"],
        id="single_input_numeric",
    ),
    pytest.param(
        [CONTENT_DEGAUSS, CONTENT_ECUTWFC_JINJA],
        r"degauss\s*=\s*[\d.e+\-]+",
        f"degauss = {RAW_SCOPE_DEGAUSS}",
        [f"degauss = {RAW_SCOPE_DEGAUSS}\n", CONTENT_ECUTWFC_JINJA],
        id="multiple_inputs_only_first_matches",
    ),
]

REPLACE_VARIABLE_VALUE_IN_INPUTS_CASES = [
    pytest.param(
        [CONTENT_DEGAUSS],
        "degauss",
        RAW_SCOPE_DEGAUSS,
        [f"degauss = {RAW_SCOPE_DEGAUSS}\n"],
        id="bare_numeric",
    ),
    pytest.param(
        [CONTENT_ECUTWFC_JINJA],
        "ecutwfc",
        RAW_SCOPE_ECUTWFC,
        [f"ecutwfc = {RAW_SCOPE_ECUTWFC}\n"],
        id="jinja_expression",
    ),
    pytest.param(
        [CONTENT_DEGAUSS, CONTENT_ECUTWFC_JINJA],
        "degauss",
        RAW_SCOPE_DEGAUSS,
        [f"degauss = {RAW_SCOPE_DEGAUSS}\n", CONTENT_ECUTWFC_JINJA],
        id="multi_input_partial_match",
    ),
]


@pytest.mark.parametrize("contents,pattern,replacement,expected_contents", REPLACE_IN_INPUT_CONTENT_CASES)
def test_replace_in_input_content(contents, pattern, replacement, expected_contents):
    unit = _make_unit(*contents)
    unit.replace_in_input_content(pattern, replacement)
    assert [item.template.content for item in unit.input] == expected_contents


@pytest.mark.parametrize("contents,variable_name,new_value,expected_contents", REPLACE_VARIABLE_VALUE_IN_INPUTS_CASES)
def test_replace_variable_value_in_inputs(contents, variable_name, new_value, expected_contents):
    unit = _make_unit(*contents)
    unit.replace_variable_value_in_inputs(variable_name, new_value)
    assert [item.template.content for item in unit.input] == expected_contents
