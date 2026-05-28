import pytest
from mat3ra.wode.context.providers import PointsPathDataProvider

KPATH_SINGLE = [{"point": "K", "steps": 20}]
KPATH_FULL = [
    {"point": "K", "steps": 20},
    {"point": "Г", "steps": 20},
    {"point": "M", "steps": 20},
    {"point": "K", "steps": 1},
]

KPATH_DATA_SINGLE = {
    "kpath": KPATH_SINGLE,
    "isKpathEdited": True,
}
KPATH_DATA_FULL = {
    "kpath": KPATH_FULL,
    "isKpathEdited": True,
}


@pytest.mark.parametrize(
    "init_params,expected_path",
    [
        ({"path": KPATH_SINGLE}, KPATH_SINGLE),
        ({"path": KPATH_FULL}, KPATH_FULL),
    ],
)
def test_points_path_data_provider_initialization(init_params, expected_path):
    provider = PointsPathDataProvider(**init_params)
    assert provider.get_data() == expected_path


@pytest.mark.parametrize(
    "init_params,expected_data",
    [
        ({"path": KPATH_SINGLE, "is_edited": True}, KPATH_DATA_SINGLE),
        ({"path": KPATH_FULL, "is_edited": True}, KPATH_DATA_FULL),
    ],
)
def test_points_path_data_provider_yield_data(init_params, expected_data):
    provider = PointsPathDataProvider(**init_params)
    assert provider.yield_data() == expected_data
