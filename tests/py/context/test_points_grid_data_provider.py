from types import SimpleNamespace

import pytest
from pydantic import ValidationError
from mat3ra.esse.models.context_providers_directory.points_grid_data_provider import (
    GridMetricType,
    PointsGridDataProviderSchema,
)
from mat3ra.wode.context.providers import PointsGridDataProvider
from mat3ra.wode.context.providers.points_grid_data_provider import DEFAULT_KPPRA, MaterialLike


def _material_stub(number_of_atoms, reciprocal_vector_ratios):
    """Stands in for `mat3ra.made.Material`, which needs scipy -- not a wode test dependency."""
    return SimpleNamespace(
        basis=SimpleNamespace(number_of_atoms=number_of_atoms),
        lattice=SimpleNamespace(reciprocal_vector_ratios=reciprocal_vector_ratios),
    )

# Test data constants
DIMENSIONS_DEFAULT = [1, 1, 1]
DIMENSIONS_CUSTOM = [1, 2, 3]
SHIFTS_DEFAULT = [0.0, 0.0, 0.0]
SHIFTS_CUSTOM = [0.5, 0.5, 0.5]
DIVISOR_DEFAULT = 1
DIVISOR_CUSTOM = 2
GRID_METRIC_TYPE_DEFAULT = GridMetricType.KPPRA
NUMBER_OF_ATOMS_DEFAULT = 1
RATIOS_DEFAULT = [1.0, 1.0, 1.0]
GRID_METRIC_VALUE_DERIVED = (
    DIMENSIONS_CUSTOM[0] * DIMENSIONS_CUSTOM[1] * DIMENSIONS_CUSTOM[2] * NUMBER_OF_ATOMS_DEFAULT
)

# Expected data structures
KGRID_DATA = {
    "kgrid": {
        "dimensions": DIMENSIONS_CUSTOM,
        "shifts": SHIFTS_DEFAULT,
        "divisor": DIVISOR_DEFAULT,
        "gridMetricType": GRID_METRIC_TYPE_DEFAULT,
        "gridMetricValue": GRID_METRIC_VALUE_DERIVED,
        "reciprocalVectorRatios": RATIOS_DEFAULT,
    },
    "isKgridEdited": True,
}

KGRID_TEMPLATE_DATA = {
    "kgrid": {
        "dimensions": ["{{N_k}}", "{{N_k}}", "{{N_k}}"],
        "shifts": SHIFTS_DEFAULT,
        "divisor": DIVISOR_DEFAULT,
        "gridMetricType": GRID_METRIC_TYPE_DEFAULT,
        "gridMetricValue": DEFAULT_KPPRA,
        "reciprocalVectorRatios": [1.0, 0.667, 0.5],
    },
    "isKgridEdited": True,
    "isUsingJinjaVariables": True,
}


@pytest.mark.parametrize(
    "init_params,expected_dimensions,expected_shifts,expected_divisor",
    [
        (
            {"dimensions": DIMENSIONS_CUSTOM, "material": _material_stub(NUMBER_OF_ATOMS_DEFAULT, RATIOS_DEFAULT)},
            DIMENSIONS_CUSTOM,
            SHIFTS_DEFAULT,
            DIVISOR_DEFAULT,
        ),
    ],
)
def test_points_grid_data_provider_initialization(init_params, expected_dimensions, expected_shifts, expected_divisor):
    kgrid_context_provider_relax = PointsGridDataProvider(**init_params)

    assert kgrid_context_provider_relax.dimensions == expected_dimensions
    assert kgrid_context_provider_relax.shifts == expected_shifts
    assert kgrid_context_provider_relax.divisor == expected_divisor


@pytest.mark.parametrize(
    "init_params,expected_data",
    [
        (
            {"dimensions": DIMENSIONS_CUSTOM, "material": _material_stub(NUMBER_OF_ATOMS_DEFAULT, RATIOS_DEFAULT)},
            KGRID_DATA,
        ),
    ],
)
def test_points_grid_data_provider_get_data(init_params, expected_data):
    kgrid_context_provider = PointsGridDataProvider(**init_params)
    actual_data = kgrid_context_provider.get_data()
    assert actual_data == expected_data["kgrid"]


@pytest.mark.parametrize(
    "init_params,expected_data",
    [
        (
            {
                "dimensions": DIMENSIONS_CUSTOM,
                "is_edited": True,
                "material": _material_stub(NUMBER_OF_ATOMS_DEFAULT, RATIOS_DEFAULT),
            },
            KGRID_DATA,
        ),
    ],
)
def test_points_grid_data_provider_yield_data(init_params, expected_data):
    kgrid_context_provider = PointsGridDataProvider(**init_params)
    actual_data = kgrid_context_provider.yield_data()
    assert actual_data == expected_data


def test_points_grid_data_provider_get_reciprocal_vector_ratios_from_provider_data():
    provider = PointsGridDataProvider(reciprocal_vector_ratios=[1.0, 0.667, 0.5])

    assert provider.get_reciprocal_vector_ratios() == [1.0, 0.667, 0.5]


def test_points_grid_data_provider_yield_data_with_overrides():
    provider = PointsGridDataProvider()

    actual_data = provider.yield_data_with_overrides(
        dimensions=["{{N_k}}", "{{N_k}}", "{{N_k}}"],
        reciprocal_vector_ratios=[1.0, 0.667, 0.5],
        is_using_jinja_variables=True,
    )

    assert actual_data == KGRID_TEMPLATE_DATA


def test_points_grid_data_provider_get_reciprocal_vector_ratios_from_context():
    provider = PointsGridDataProvider(
        context={
            "kgrid": {"reciprocalVectorRatios": [1.0, 0.8, 0.6]},
            "isKgridEdited": True,
        }
    )

    assert provider.get_reciprocal_vector_ratios() == [1.0, 0.8, 0.6]


def test_points_grid_data_provider_raises_when_atom_count_is_unknown():
    """KPPRA is per reciprocal atom: assuming one atom silently under-reports it by that count."""
    with pytest.raises(ValidationError, match="KPPRA"):
        PointsGridDataProvider(dimensions=[4, 4, 4], isEdited=True)


def test_material_derived_ratios_land_in_the_schema_field():
    """
    Derivation must populate the ESSE field, not just the emitted dict.

    A schema-driven `default_data` (`model_dump(include=<schema fields>, exclude_none=True)`, as on
    fix/points-grid-context-schema-drift) reads the field, so deriving at read time only would drop
    the ratios again and silently restore the k-grid edit lock.
    """
    material = _material_stub(number_of_atoms=2, reciprocal_vector_ratios=[1.0, 0.5, 0.25])

    provider = PointsGridDataProvider(dimensions=[4, 4, 4], material=material, isEdited=True)

    assert provider.reciprocalVectorRatios == [1.0, 0.5, 0.25]
    schema_only = provider.model_dump(
        by_alias=True, exclude_none=True, include=set(PointsGridDataProviderSchema.model_fields)
    )
    assert schema_only["reciprocalVectorRatios"] == [1.0, 0.5, 0.25]


def test_points_grid_data_provider_derives_grid_metric_value_and_ratios_from_material():
    material = _material_stub(number_of_atoms=2, reciprocal_vector_ratios=[1.0, 0.5, 0.25])

    data = PointsGridDataProvider(dimensions=[4, 4, 4], material=material, isEdited=True).get_data()

    assert data["gridMetricValue"] == 4 * 4 * 4 * 2
    assert data["reciprocalVectorRatios"] == [1.0, 0.5, 0.25]


def test_points_grid_data_provider_respects_explicit_grid_metric_value():
    provider = PointsGridDataProvider(dimensions=[4, 4, 4], isEdited=True, gridMetricValue=999)

    assert provider.get_data()["gridMetricValue"] == 999


def test_points_grid_data_provider_rounds_ratios_to_three_figures_like_js():
    """JS rounds to 3 s.f.; unrounded floats would diverge from what the UI persists."""
    material = _material_stub(2, [1.0, 0.8164965809277261, 0.6123724356957945])

    provider = PointsGridDataProvider(dimensions=[4, 4, 4], material=material, isEdited=True)

    assert provider.get_data()["reciprocalVectorRatios"] == [1.0, 0.816, 0.612]


def test_points_grid_data_provider_raises_actionable_error_for_wrong_shaped_material():
    """`isinstance` against a Protocol is not recursive, so a bad shape only fails on access."""
    with pytest.raises(ValidationError, match="KPPRA"):
        PointsGridDataProvider(dimensions=[4, 4, 4], material=SimpleNamespace(basis=1, lattice=2))


def test_points_grid_data_provider_untouched_default_keeps_sentinel():
    provider = PointsGridDataProvider()

    assert provider.get_data()["gridMetricValue"] == DEFAULT_KPPRA


def test_real_material_satisfies_the_protocol_and_drives_derivation():
    """
    Every other test uses a stub built to satisfy `MaterialLike`, so it cannot catch a rename on
    the made side -- which would leave wode green and break every notebook call site.

    Skipped where scipy is absent: `mat3ra-made` ships it only under its `tools` extra.
    """
    pytest.importorskip("scipy")
    from mat3ra.made.material import Material
    from mat3ra.standata.materials import Materials

    material = Material.create(Materials.get_by_name_first_match("Silicon"))
    assert isinstance(material, MaterialLike)

    data = PointsGridDataProvider(dimensions=[4, 4, 4], material=material, isEdited=True).get_data()

    assert data["gridMetricValue"] == 4 * 4 * 4 * material.basis.number_of_atoms
    assert len(data["reciprocalVectorRatios"]) == 3
