from mat3ra.made.lattice import Lattice
from mat3ra.standata.workflows import WorkflowStandata
from mat3ra.wode import Workflow
from mat3ra.wode.subworkflows.convergence import ConvergenceParameterName


def _build_total_energy_subworkflow():
    workflow_config = WorkflowStandata.filter_by_application("espresso").get_by_name_first_match("total_energy.json")
    workflow = Workflow.create(workflow_config)
    return workflow.subworkflows[0]


def test_add_uniform_energy_convergence():
    subworkflow = _build_total_energy_subworkflow()

    subworkflow.add_convergence(
        parameter=ConvergenceParameterName.N_k,
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

    assert subworkflow.convergence_param == ConvergenceParameterName.N_k.value
    assert subworkflow.convergence_result == "total_energy"
    assert subworkflow.has_convergence is True

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterName.N_k.value
    assert update_parameter.value == f"{ConvergenceParameterName.N_k.value} + 1"
    assert update_parameter.next == pw_scf.flowchartId

    check_convergence = subworkflow.get_unit_by_name(name="check convergence")
    assert check_convergence.input == []
    assert check_convergence.statement == "abs((prev_result-total_energy)/total_energy) < 0.001"
    assert check_convergence.maxOccurrences == 10

    assert subworkflow.find_unit_with_tag("hasConvergenceParam").operand == ConvergenceParameterName.N_k.value
    assert subworkflow.find_unit_with_tag("hasConvergenceResult").operand == "total_energy"


def test_add_non_uniform_energy_convergence():
    subworkflow = _build_total_energy_subworkflow()
    reciprocal_vector_ratios = [1.0, 1.5, 2.0]

    subworkflow.add_convergence(
        parameter=ConvergenceParameterName.N_k_nonuniform,
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
        f"{{{{{ConvergenceParameterName.N_k_nonuniform.value}[0]}}}}",
        f"{{{{{ConvergenceParameterName.N_k_nonuniform.value}[1]}}}}",
        f"{{{{{ConvergenceParameterName.N_k_nonuniform.value}[2]}}}}",
    ]
    assert pw_scf.context["kgrid"]["reciprocalVectorRatios"] == reciprocal_vector_ratios

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterName.N_k_nonuniform.value
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
        parameter=ConvergenceParameterName.N_k_nonuniform_2D,
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
        f"{{{{{ConvergenceParameterName.N_k_nonuniform_2D.value}[0]}}}}",
        f"{{{{{ConvergenceParameterName.N_k_nonuniform_2D.value}[1]}}}}",
        f"{{{{{ConvergenceParameterName.N_k_nonuniform_2D.value}[2]}}}}",
    ]
    assert pw_scf.context["kgrid"]["reciprocalVectorRatios"] == reciprocal_vector_ratios

    update_parameter = subworkflow.get_unit_by_name(name="update parameter")
    assert update_parameter.operand == ConvergenceParameterName.N_k_nonuniform_2D.value
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
        parameter=ConvergenceParameterName.N_k,
        parameter_initial=1,
        parameter_increment=1,
        result="total_energy",
        result_initial=0,
        tolerance=0.001,
    )

    scope_track = [
        {"scope": {"global": {ConvergenceParameterName.N_k.value: 1, "total_energy": -10.0}}},
        {"scope": {"global": {ConvergenceParameterName.N_k.value: 1, "total_energy": -10.0}}},
        {"scope": {"global": {ConvergenceParameterName.N_k.value: 2, "total_energy": -10.5}}},
        {"scope": {"global": {ConvergenceParameterName.N_k.value: 3}}},
    ]

    assert subworkflow.convergence_series(scope_track) == [
        {"x": 1, "param": 1, "y": -10.0},
        {"x": 2, "param": 2, "y": -10.5},
    ]
