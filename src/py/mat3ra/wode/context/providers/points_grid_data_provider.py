import math
from typing import Any, Dict, List, Optional, Protocol, runtime_checkable

from mat3ra.esse.models.context_providers_directory.points_grid_data_provider import (
    GridMetricType,
    PointsGridDataProviderSchema,
)
from pydantic import Field, model_validator

from .base.context_provider import ContextProvider

DEFAULT_KPPRA = -1


class BasisLike(Protocol):
    """Not `runtime_checkable`: protocol checks are not recursive, so it is never an isinstance subject."""

    number_of_atoms: int


class LatticeLike(Protocol):
    """Not `runtime_checkable`, for the same reason as `BasisLike`."""

    reciprocal_vector_ratios: List[float]


@runtime_checkable
class MaterialLike(Protocol):
    """
    Structural type for `mat3ra.made.material.Material`.

    Declared structurally because `mat3ra-made` only ships scipy under its `tools` extra while
    importing `Material` requires it, so a nominal import would make `mat3ra.wode` unimportable
    on a plain install.
    """

    basis: BasisLike
    lattice: LatticeLike


# TODO: GlobalSetting for default KPPRA value
class PointsGridDataProvider(PointsGridDataProviderSchema, ContextProvider):
    """
    Context provider for k-point/q-point grid configuration.

    Handles grid dimensions and shifts for reciprocal space sampling.

    KPPRA and reciprocal vector ratios are properties of the material, so they are derived from
    `material` -- as the JS provider does, which is always constructed with one. Absent it they are
    not guessed: KPPRA raises rather than silently assuming a single atom, which would under-report
    the metric by a factor of the atom count.

    Parity with the JS provider is limited to that derivation. `preferGridMetric` is persisted but
    not acted on -- JS's `setData` derives dimensions *from* the metric when it is true, and this
    class always derives the metric from dimensions.
    """

    name: str = Field(default="kgrid")
    divisor: int = Field(default=1)
    dimensions: List[int] = Field(default_factory=lambda: [1, 1, 1], min_length=3, max_length=3)
    shifts: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])
    gridMetricType: GridMetricType = Field(default=GridMetricType.KPPRA)
    gridMetricValue: float = Field(default=DEFAULT_KPPRA)
    material: Optional[MaterialLike] = Field(default=None, exclude=True)

    @model_validator(mode="after")
    def _derive_grid_metric_and_ratios(self) -> "PointsGridDataProvider":
        """
        Derive the grid metric and reciprocal vector ratios once the model is populated.

        Runs after initialization because it needs `dimensions`, `gridMetricType` and the atom
        count together. Only fires when dimensions were given explicitly without a metric, so an
        explicit `gridMetricValue` is never overwritten.

        Assigning here adds both names to `model_fields_set`, so a derived value is thereafter
        indistinguishable from a supplied one -- which matters because the guard above reads that
        set. Nothing consumes `exclude_unset` on this model today.
        """
        if "dimensions" in self.model_fields_set and "gridMetricValue" not in self.model_fields_set:
            self.gridMetricValue = self.calculate_grid_metric(self.gridMetricType, self.dimensions)
        if self.reciprocalVectorRatios is None and self.material is not None:
            ratios = self._read_from_material(lambda m: m.lattice.reciprocal_vector_ratios)
            if len(ratios) != 3:
                # `validate_assignment` is off, so ESSE's min/max_length does not run on assignment.
                raise ValueError(f"Expected 3 reciprocal vector ratios from the material, got {len(ratios)}")
            # JS rounds to 3 significant figures; unrounded floats would make the context a job was
            # created with differ from the one the UI writes for the same material.
            self.reciprocalVectorRatios = [round(float(r), 3) for r in ratios]
        return self

    def _read_from_material(self, read):
        """`isinstance` against MaterialLike is not recursive, so a wrong shape only fails here."""
        try:
            return read(self.material)
        except AttributeError as error:
            raise ValueError(f"{self._MATERIAL_REQUIRED}. Got {type(self.material).__name__}: {error}")

    _MATERIAL_REQUIRED = (
        "KPPRA is defined per reciprocal atom and the reciprocal vector ratios come from the "
        "lattice, so both need the material. Pass material=<mat3ra.made.Material>"
    )

    def get_number_of_atoms(self) -> int:
        """A method, not a property: it raises when there is no material to read."""
        if self.material is not None:
            return self._read_from_material(lambda m: m.basis.number_of_atoms)
        raise ValueError(self._MATERIAL_REQUIRED)

    @property
    def is_edited_key(self) -> str:
        return "isKgridEdited"

    @property
    def default_data(self) -> Dict[str, Any]:
        data = {
            "dimensions": self.dimensions,
            "shifts": self.shifts,
            "gridMetricType": self.grid_metric_type,
            "divisor": self.divisor,
        }
        if self.grid_metric_value is not None:
            data["gridMetricValue"] = self.grid_metric_value
        if self.prefer_grid_metric is not None:
            data["preferGridMetric"] = self.prefer_grid_metric
        if self.reciprocal_vector_ratios is not None:
            data["reciprocalVectorRatios"] = self.reciprocal_vector_ratios
        return data

    def get_reciprocal_vector_ratios(self, context: Optional[Dict[str, Any]] = None) -> Optional[List[float]]:
        effective_data = self._get_effective_data(context)
        if isinstance(effective_data, dict) and "reciprocalVectorRatios" in effective_data:
            return effective_data["reciprocalVectorRatios"]
        return self.reciprocal_vector_ratios

    def build_data(
        self,
        *,
        dimensions: Optional[List[Any]] = None,
        shifts: Optional[List[float]] = None,
        reciprocal_vector_ratios: Optional[List[float]] = None,
        grid_metric_type: Optional[str] = None,
        grid_metric_value: Optional[float] = None,
        prefer_grid_metric: Optional[bool] = None,
        divisor: Optional[int] = None,
    ) -> Dict[str, Any]:
        data = dict(self.default_data)
        overrides = {
            "dimensions": dimensions,
            "shifts": shifts,
            "reciprocalVectorRatios": reciprocal_vector_ratios,
            "gridMetricType": grid_metric_type,
            "gridMetricValue": grid_metric_value,
            "preferGridMetric": prefer_grid_metric,
            "divisor": divisor,
        }
        data.update({key: value for key, value in overrides.items() if value is not None})
        return data

    def yield_data_with_overrides(
        self,
        *,
        dimensions: Optional[List[Any]] = None,
        shifts: Optional[List[float]] = None,
        reciprocal_vector_ratios: Optional[List[float]] = None,
        grid_metric_type: Optional[str] = None,
        grid_metric_value: Optional[float] = None,
        prefer_grid_metric: Optional[bool] = None,
        divisor: Optional[int] = None,
        is_using_jinja_variables: bool = False,
    ) -> Dict[str, Any]:
        context = self.yield_data(
            context={
                self.name_str: self.build_data(
                    dimensions=dimensions,
                    shifts=shifts,
                    reciprocal_vector_ratios=reciprocal_vector_ratios,
                    grid_metric_type=grid_metric_type,
                    grid_metric_value=grid_metric_value,
                    prefer_grid_metric=prefer_grid_metric,
                    divisor=divisor,
                ),
                self.is_edited_key: True,
            }
        )
        if is_using_jinja_variables:
            context["isUsingJinjaVariables"] = True
        return context

    # TODO: add a test to verify context and templates are the same as from JS implementation
    def get_default_grid_metric_value(self, metric: str) -> float:
        raise NotImplementedError

    def calculate_dimensions(
        self, grid_metric_type: GridMetricType, grid_metric_value: float, units: str = "angstrom"
    ) -> List[int]:
        raise NotImplementedError

    def calculate_grid_metric(
        self, grid_metric_type: GridMetricType, dimensions: List[int], units: str = "angstrom"
    ) -> float:
        if grid_metric_type == GridMetricType.KPPRA:
            return math.prod(dimensions) * self.get_number_of_atoms()
        raise NotImplementedError(f"calculate_grid_metric not implemented for {grid_metric_type}")

    def transform_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError
