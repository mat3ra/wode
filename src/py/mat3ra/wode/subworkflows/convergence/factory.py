from typing import Any, List, Optional

from .non_uniform_kgrid import NonUniformKGridConvergence
from .parameter import ConvergenceParameter
from .uniform_kgrid import UniformKGridConvergence


def create_convergence_parameter(
    name: str,
    initial_value: Any,
    increment: Any,
    reciprocal_vector_ratios: Optional[List[float]] = None,
) -> ConvergenceParameter:
    if name == "N_k":
        return UniformKGridConvergence(name=name, initial_value=initial_value, increment=increment)
    if name == "N_k_nonuniform":
        return NonUniformKGridConvergence(
            name=name,
            initial_value=initial_value,
            increment=increment,
            reciprocal_vector_ratios=reciprocal_vector_ratios,
        )
    raise ValueError(f"Unsupported convergence parameter: {name}")
