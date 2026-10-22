"""Python implementations of the providers declared by STANDATA templates."""

from math import isfinite

from .by_application.espresso.qe_pwx_context_provider import QEPWXContextProvider
from .planewave_cutoffs_context_provider import PlanewaveCutoffsContextProvider
from .points_grid_data_provider import PointsGridDataProvider


def _create_grid(context, data):
    if data.get("preferGridMetric"):
        raise NotImplementedError("Python rendering requires explicit k-grid dimensions")
    return PointsGridDataProvider(material=context["material"], **data)


def _create_cutoffs(context, data):
    provider = PlanewaveCutoffsContextProvider(**data)
    if any(value is None or not isfinite(value) or value <= 0 for value in (provider.wavefunction, provider.density)):
        raise ValueError("Rendering requires positive, finite wavefunction and density cutoffs")
    return provider


PROVIDERS = {
    "QEPWXInputDataManager": ("input", QEPWXContextProvider.from_context),
    "KGridFormDataManager": ("kgrid", _create_grid),
    "PlanewaveCutoffDataManager": ("cutoffs", _create_cutoffs),
}


def create_provider(name, unit_context, external_context):
    try:
        context_name, factory = PROVIDERS[name]
    except KeyError:
        raise NotImplementedError(f"No Python rendering provider for {name!r}") from None
    item = next((item for item in unit_context if item["name"] == context_name), {})
    provider = factory(external_context, item.get("data") or {})
    provider.is_edited = item.get("isEdited", False)
    provider.extra_data = item.get("extraData")
    return provider
