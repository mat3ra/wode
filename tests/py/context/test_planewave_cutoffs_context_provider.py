import pytest
from mat3ra.wode.context.providers import PlanewaveCutoffsContextProvider

ECUTWFC = 50.0
ECUTRHO = 200.0

CUTOFFS_DATA = {
    "cutoffs": {"wavefunction": ECUTWFC, "density": ECUTRHO},
    "isCutoffsEdited": True,
}


@pytest.mark.parametrize(
    "init_params,expected_wavefunction,expected_density",
    [
        ({"wavefunction": ECUTWFC, "density": ECUTRHO}, ECUTWFC, ECUTRHO),
        ({"wavefunction": ECUTWFC}, ECUTWFC, None),
    ],
)
def test_planewave_cutoffs_context_provider_initialization(init_params, expected_wavefunction, expected_density):
    provider = PlanewaveCutoffsContextProvider(**init_params)
    assert provider.wavefunction == expected_wavefunction
    assert provider.density == expected_density


@pytest.mark.parametrize(
    "init_params,expected_data",
    [
        ({"wavefunction": ECUTWFC, "density": ECUTRHO, "is_edited": True}, CUTOFFS_DATA),
    ],
)
def test_planewave_cutoffs_context_provider_yield_data(init_params, expected_data):
    provider = PlanewaveCutoffsContextProvider(**init_params)
    assert provider.yield_data() == expected_data
