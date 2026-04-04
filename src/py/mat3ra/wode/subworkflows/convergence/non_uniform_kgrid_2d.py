from .non_uniform_kgrid import NonUniformKGridConvergence


class NonUniformKGridConvergence2D(NonUniformKGridConvergence):
    @property
    def increment(self) -> str:
        return (
            f"[{self.initial_value}[i] + math.floor(iteration * {self._increment} * "
            "float(context['kgrid']['reciprocalVectorRatios'][i])) for i in range(2)] + [1]"
        )
