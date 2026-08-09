import pytest
from mat3ra.esse.models.context_providers_directory.points_grid_data_provider import GridMetricType
from mat3ra.wode.context.providers import PointsGridDataProvider
from mat3ra.wode.context.providers.points_grid_data_provider import DEFAULT_KPPRA

# Test data constants
DIMENSIONS_DEFAULT = [1, 1, 1]
DIMENSIONS_CUSTOM = [1, 2, 3]
SHIFTS_DEFAULT = [0.0, 0.0, 0.0]
SHIFTS_CUSTOM = [0.5, 0.5, 0.5]
DIVISOR_DEFAULT = 1
DIVISOR_CUSTOM = 2
GRID_METRIC_TYPE_DEFAULT = GridMetricType.KPPRA
# Explicit dimensions with no explicit metric are derived (dims product * n_atoms, n_atoms=1 here),
# not left at DEFAULT_KPPRA -- that sentinel would otherwise be persisted as isEdited=True and lock
# the k-grid from further editing in the UI (its form schema requires gridMetricValue >= 1).
GRID_METRIC_VALUE_DERIVED = DIMENSIONS_CUSTOM[0] * DIMENSIONS_CUSTOM[1] * DIMENSIONS_CUSTOM[2]

# Expected data structures
KGRID_DATA = {
    "kgrid": {
        "dimensions": DIMENSIONS_CUSTOM,
        "shifts": SHIFTS_DEFAULT,
        "divisor": DIVISOR_DEFAULT,
        "gridMetricType": GRID_METRIC_TYPE_DEFAULT,
        "gridMetricValue": GRID_METRIC_VALUE_DERIVED,
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
            {"dimensions": DIMENSIONS_CUSTOM},
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
            {"dimensions": DIMENSIONS_CUSTOM},
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
            {"dimensions": DIMENSIONS_CUSTOM, "is_edited": True},
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


def test_points_grid_data_provider_derives_grid_metric_value_when_only_dimensions_given():
    provider = PointsGridDataProvider(dimensions=[4, 4, 4], isEdited=True)

    assert provider.get_data()["gridMetricValue"] == 64
    assert provider.get_data()["gridMetricValue"] != DEFAULT_KPPRA


def test_points_grid_data_provider_respects_explicit_grid_metric_value():
    provider = PointsGridDataProvider(dimensions=[4, 4, 4], isEdited=True, gridMetricValue=999)

    assert provider.get_data()["gridMetricValue"] == 999


def test_points_grid_data_provider_derives_grid_metric_value_using_n_atoms():
    provider = PointsGridDataProvider(dimensions=[4, 4, 4], isEdited=True, n_atoms=2)

    assert provider.get_data()["gridMetricValue"] == 128


def test_points_grid_data_provider_untouched_default_keeps_sentinel():
    provider = PointsGridDataProvider()

    assert provider.get_data()["gridMetricValue"] == DEFAULT_KPPRA
