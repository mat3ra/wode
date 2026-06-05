from typing import Any, List, Optional

from mat3ra.esse.models.workflow.subworkflow.convergence.enum_options import ConvergenceParameterNameEnum

from .non_uniform_kgrid import NonUniformKGridConvergence
from .non_uniform_kgrid_2d import NonUniformKGridConvergence2D
from .parameter import ConvergenceParameter
from .uniform_kgrid import UniformKGridConvergence


def create_convergence_parameter(
    name: str,
    initial_value: Any,
    increment: Any,
    reciprocal_vector_ratios: Optional[List[float]] = None,
) -> ConvergenceParameter:
    parameter_name = ConvergenceParameterNameEnum(name)

    if parameter_name == ConvergenceParameterNameEnum.N_k:
        return UniformKGridConvergence(name=parameter_name.value, initial_value=initial_value, increment=increment)
    if parameter_name == ConvergenceParameterNameEnum.N_k_nonuniform:
        return NonUniformKGridConvergence(
            name=parameter_name.value,
            initial_value=initial_value,
            increment=increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )
    if parameter_name == ConvergenceParameterNameEnum.N_k_nonuniform_2D:
        return NonUniformKGridConvergence2D(
            name=parameter_name.value,
            initial_value=initial_value,
            increment=increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )
    else:
        return ConvergenceParameter(name=parameter_name.value, initial_value=initial_value, increment=increment)
