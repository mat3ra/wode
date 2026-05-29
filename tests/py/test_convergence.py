import pytest
from mat3ra.esse.models.workflow.subworkflow.convergence.enum_options import ConvergenceParameterNameEnum
from mat3ra.made.lattice import Lattice
from mat3ra.standata.workflows import WorkflowStandata

from mat3ra.wode import Workflow


def _build_total_energy_subworkflow():
    workflow_config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match("total_energy.json")
    workflow = Workflow.create(workflow_config)
    return workflow.subworkflows[0]


def test_add_uniform_energy_convergence():
    subworkflow = _build_total_energy_subworkflow()

    subworkflow.add_convergence(
        parameter=ConvergenceParameterNameEnum.N_k.value,
        parameter_initial=1,
        parameter_increment=1,
        result="total_energy",
        result_initial=0,
        condition="abs((prev_result-total_energy)/total_energy)",
        operator="<",
        tolerance=0.001,
        max_occurrences=10,
    )

    assert [unit.name for unit in subworkflow.units] == [
        "init parameter",
        "init result",
        "init counter",
        "pw_scf",
        "update result",
        "check convergence",
        "store result",
        "update counter",
        "update parameter",
        "exit",
    ]

    pw_scf = subworkflow.get_unit_by_name(name="pw_scf")
    assert pw_scf.context["kgrid"]["dimensions"] == ["{{N_k}}", "{{N_k}}", "{{N_k}}"]
    assert pw_scf.context["kgrid"]["shifts"] == [0, 0, 0]
    assert pw_scf.context["isKgridEdited"] is True
    assert pw_scf.context["isUsingJinjaVariables"] is True

    assert subworkflow.convergence_parameter == ConvergenceParameterNameEnum.N_k.value
    assert subworkflow.convergence_result == "total_energy"
    assert subworkflow.has_convergence is True

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterNameEnum.N_k.value
    assert update_parameter.value == f"{ConvergenceParameterNameEnum.N_k.value} + 1"
    assert update_parameter.next == pw_scf.flowchartId

    check_convergence = subworkflow.get_unit_by_name(name="check convergence")
    assert check_convergence.input == []
    assert check_convergence.statement == "abs((prev_result-total_energy)/total_energy) < 0.001"
    assert check_convergence.maxOccurrences == 10

    assert subworkflow.find_unit_with_tag("hasConvergenceParam").operand == ConvergenceParameterNameEnum.N_k.value
    assert subworkflow.find_unit_with_tag("hasConvergenceResult").operand == "total_energy"


def test_add_non_uniform_energy_convergence():
    subworkflow = _build_total_energy_subworkflow()
    reciprocal_vector_ratios = [1.0, 1.5, 2.0]

    subworkflow.add_convergence(
        parameter=ConvergenceParameterNameEnum.N_k_nonuniform,
        parameter_initial=[2, 2, 1],
        parameter_increment=2,
        reciprocal_vector_ratios=reciprocal_vector_ratios,
        result="total_energy",
        result_initial=0,
        condition="abs((prev_result-total_energy)/total_energy)",
        operator="<",
        tolerance=0.001,
        max_occurrences=10,
    )

    pw_scf = subworkflow.get_unit_by_name(name="pw_scf")
    assert pw_scf.context["kgrid"]["dimensions"] == [
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform.value}[0]}}}}",
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform.value}[1]}}}}",
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform.value}[2]}}}}",
    ]
    assert pw_scf.context["kgrid"]["reciprocalVectorRatios"] == reciprocal_vector_ratios

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterNameEnum.N_k_nonuniform.value
    assert update_parameter.input == [{"scope": pw_scf.flowchartId, "name": "context"}]
    assert (
        update_parameter.value
        == "[[2,2,1][i] + math.floor(iteration * 2 * float(context['kgrid']['reciprocalVectorRatios'][i])) "
        "for i in range(3)]"
    )


def test_add_non_uniform_2d_energy_convergence():
    subworkflow = _build_total_energy_subworkflow()
    reciprocal_vector_ratios = [1.0, 1.5, 0.25]

    subworkflow.add_convergence(
        parameter=ConvergenceParameterNameEnum.N_k_nonuniform_2D,
        parameter_initial=[2, 2, 1],
        parameter_increment=2,
        reciprocal_vector_ratios=reciprocal_vector_ratios,
        result="total_energy",
        result_initial=0,
        condition="abs((prev_result-total_energy)/total_energy)",
        operator="<",
        tolerance=0.001,
        max_occurrences=10,
    )

    pw_scf = subworkflow.get_unit_by_name(name="pw_scf")
    assert pw_scf.context["kgrid"]["dimensions"] == [
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform_2D.value}[0]}}}}",
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform_2D.value}[1]}}}}",
        f"{{{{{ConvergenceParameterNameEnum.N_k_nonuniform_2D.value}[2]}}}}",
    ]
    assert pw_scf.context["kgrid"]["reciprocalVectorRatios"] == reciprocal_vector_ratios

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterNameEnum.N_k_nonuniform_2D.value
    assert update_parameter.input == [{"scope": pw_scf.flowchartId, "name": "context"}]
    assert (
        update_parameter.value
        == "[[2,2,1][i] + math.floor(iteration * 2 * float(context['kgrid']['reciprocalVectorRatios'][i])) "
        "for i in range(2)] + [1]"
    )


def test_lattice_reciprocal_vector_ratios():
    lattice = Lattice.from_vectors_array(
        [
            [1.0, 0.0, 0.0],
            [0.0, 2.0, 0.0],
            [0.0, 0.0, 4.0],
        ]
    )

    assert lattice.reciprocal_vector_ratios == [1.0, 0.5, 0.25]


def test_convergence_series_uses_scope_track():
    subworkflow = _build_total_energy_subworkflow()

    subworkflow.add_convergence(
        parameter=ConvergenceParameterNameEnum.N_k,
        parameter_initial=1,
        parameter_increment=1,
        result="total_energy",
        result_initial=0,
        tolerance=0.001,
    )

    scope_track = [
        {"scope": {"global": {ConvergenceParameterNameEnum.N_k.value: 1, "total_energy": -10.0}}},
        {"scope": {"global": {ConvergenceParameterNameEnum.N_k.value: 1, "total_energy": -10.0}}},
        {"scope": {"global": {ConvergenceParameterNameEnum.N_k.value: 2, "total_energy": -10.5}}},
        {"scope": {"global": {ConvergenceParameterNameEnum.N_k.value: 3}}},
    ]

    assert subworkflow.convergence_series(scope_track) == [
        {"x": 1, "parameter": 1, "y": -10.0},
        {"x": 2, "parameter": 2, "y": -10.5},
    ]


TEMPLATE_PARAM_TEST_CASES = [
    pytest.param(
        "degauss",
        0.001,
        0.002,
        "total_energy",
        "degauss = 0.005",
        id="degauss_bare_numeric",
    ),
    pytest.param(
        "ecutwfc",
        20,
        10,
        "total_energy",
        "ecutwfc = {{ cutoffs.wavefunction }}",
        id="ecutwfc_jinja_expression",
    ),
]


@pytest.mark.parametrize(
    "param_name,param_initial,param_increment,result_name,original_pattern", TEMPLATE_PARAM_TEST_CASES
)
def test_add_template_param_convergence(param_name, param_initial, param_increment, result_name, original_pattern):
    subworkflow = _build_total_energy_subworkflow()

    subworkflow.add_template_parameter_convergence(
        parameter_name=param_name,
        parameter_initial=param_initial,
        parameter_increment=param_increment,
        result_name=result_name,
        tolerance=1e-3,
    )

    assert [unit.name for unit in subworkflow.units] == [
        "init parameter",
        "init result",
        "init counter",
        "pw_scf",
        "update result",
        "check convergence",
        "store result",
        "update counter",
        "update parameter",
        "exit",
    ]

    pw_scf = subworkflow.get_unit_by_name(name="pw_scf")
    assert pw_scf.context[param_name] == param_initial
    input_item = pw_scf.input[0]
    template_content = input_item.template.content
    assert f"{param_name} = {{% raw %}}{{{{ {param_name} }}}}{{% endraw %}}" in template_content
    assert original_pattern not in template_content

    assert subworkflow.convergence_parameter == param_name
    assert subworkflow.convergence_result == result_name
    assert subworkflow.has_convergence is True

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == param_name
    assert update_parameter.value == f"{param_name} + {param_increment}"
    assert update_parameter.input == []
    assert update_parameter.next == pw_scf.flowchartId

    exit_unit = subworkflow.get_unit_by_name(name="exit")
    assert exit_unit.operand == param_name
    assert exit_unit.value == param_name


def test_add_template_param_convergence_multi_unit():
    workflow_config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match("band_structure.json")
    workflow = Workflow.create(workflow_config)
    subworkflow = workflow.subworkflows[0]

    subworkflow.add_template_parameter_convergence(
        parameter_name="ecutwfc",
        parameter_initial=20,
        parameter_increment=10,
        result_name="total_energy",
    )

    execution_units = [u for u in subworkflow.units if u.type == "execution"]
    assert len(execution_units) == 3

    pw_scf = subworkflow.get_unit_by_name("pw_scf")
    pw_bands = subworkflow.get_unit_by_name("pw_bands")

    for unit in [pw_scf, pw_bands]:
        assert unit.context["ecutwfc"] == 20
        input_item = unit.input[0]
        template_content = input_item.template.content
        assert "ecutwfc = {% raw %}{{ ecutwfc }}{% endraw %}" in template_content
        assert "ecutwfc = {{ cutoffs.wavefunction }}" not in template_content

    assert subworkflow.convergence_parameter == "ecutwfc"
    assert subworkflow.convergence_result == "total_energy"
