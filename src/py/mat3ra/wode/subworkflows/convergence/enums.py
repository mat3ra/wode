from enum import Enum


class ConvergenceParameterName(str, Enum):
    N_k = "N_k"
    N_k_nonuniform = "N_k_nonuniform"
    N_k_nonuniform_2D = "N_k_nonuniform_2D"
