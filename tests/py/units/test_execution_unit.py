import pytest
from mat3ra.ade import Template
from mat3ra.wode.units.execution import ExecutionUnit, ExecutionUnitInputItem

CONTENT_DEGAUSS_NUMERIC = "degauss = 0.005\n"
CONTENT_ECUTWFC_JINJA = "ecutwfc = {{ cutoffs.wavefunction }}\n"

PATTERN_DEGAUSS_NUMERIC = r"degauss\s*=\s*[\d.e+\-]+"

RAW_SCOPE_DEGAUSS = "{% raw %}{{ degauss }}{% endraw %}"
RAW_SCOPE_ECUTWFC = "{% raw %}{{ ecutwfc }}{% endraw %}"

REPLACEMENT_DEGAUSS_RAW = f"degauss = {RAW_SCOPE_DEGAUSS}"

EXPECTED_DEGAUSS_REPLACED = f"degauss = {RAW_SCOPE_DEGAUSS}\n"
EXPECTED_ECUTWFC_REPLACED = f"ecutwfc = {RAW_SCOPE_ECUTWFC}\n"


def _make_unit(*contents: str) -> ExecutionUnit:
    inputs = [
        ExecutionUnitInputItem(template=Template(name="pw.in", content=c), rendered=c)
        for c in contents
    ]
    return ExecutionUnit(name="pw_scf", input=inputs)


@pytest.mark.parametrize(
    "contents,pattern,replacement,expected_contents",
    [
        ([CONTENT_DEGAUSS_NUMERIC], PATTERN_DEGAUSS_NUMERIC, REPLACEMENT_DEGAUSS_RAW, [EXPECTED_DEGAUSS_REPLACED]),
        (
            [CONTENT_DEGAUSS_NUMERIC, CONTENT_ECUTWFC_JINJA],
            PATTERN_DEGAUSS_NUMERIC,
            REPLACEMENT_DEGAUSS_RAW,
            [EXPECTED_DEGAUSS_REPLACED, CONTENT_ECUTWFC_JINJA],
        ),
    ],
)
def test_replace_in_input_content(contents, pattern, replacement, expected_contents):
    unit = _make_unit(*contents)
    unit.replace_in_input_content(pattern, replacement)
    assert [item.template.content for item in unit.input] == expected_contents


@pytest.mark.parametrize(
    "contents,variable_name,new_value,expected_contents",
    [
        ([CONTENT_DEGAUSS_NUMERIC], "degauss", RAW_SCOPE_DEGAUSS, [EXPECTED_DEGAUSS_REPLACED]),
        ([CONTENT_ECUTWFC_JINJA], "ecutwfc", RAW_SCOPE_ECUTWFC, [EXPECTED_ECUTWFC_REPLACED]),
        (
            [CONTENT_DEGAUSS_NUMERIC, CONTENT_ECUTWFC_JINJA],
            "degauss",
            RAW_SCOPE_DEGAUSS,
            [EXPECTED_DEGAUSS_REPLACED, CONTENT_ECUTWFC_JINJA],
        ),
    ],
)
def test_replace_variable_value_in_inputs(contents, variable_name, new_value, expected_contents):
    unit = _make_unit(*contents)
    unit.replace_variable_value_in_inputs(variable_name, new_value)
    assert [item.template.content for item in unit.input] == expected_contents
