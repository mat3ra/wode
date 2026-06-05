from typing import Any, List, Optional, Union

from mat3ra.ade.application import Application
from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.workflow.subworkflow import SubworkflowSchema
from mat3ra.mode import DFTModel
from mat3ra.mode.method import Method
from mat3ra.mode.model import Model
from mat3ra.mode.models.factory import ModelFactory
from mat3ra.utils.uuid import get_uuid
from pydantic import ConfigDict, Field, SerializeAsAny, field_validator

from .convergence_mixin import ConvergenceMixin
from ..mixins import FlowchartUnitsManager
from ..units import ExecutionUnit, SubworkflowUnit, Unit
from ..units.builders import build_execution_unit_config


class Subworkflow(
    ConvergenceMixin,
    SubworkflowSchema,
    HashedEntityMixin,
    InMemoryEntitySnakeCase,
    FlowchartUnitsManager[Unit],
):
    """
    Subworkflow class representing a logical collection of workflow units.

    Attributes:
        name: Name of the subworkflow
        application: Application configuration
        model: Model configuration
        units: List of units in the subworkflow
        properties: List of properties extracted by the subworkflow
    """

    model_config = ConfigDict(validate_assignment=True)

    id: str = Field(default_factory=get_uuid, alias="_id")
    application: Application = Field(
        default_factory=lambda: Application(name="", version="", build="", shortName="", summary="")
    )
    properties: List[str] = Field(default_factory=list)
    model: SerializeAsAny[Model] = Field(default_factory=DFTModel)
    units: List[SerializeAsAny[Union[Unit, ExecutionUnit, SubworkflowUnit]]] = Field(default_factory=list)

    @field_validator("model", mode="before")
    @classmethod
    def _instantiate_model(cls, value: Any) -> Any:
        if isinstance(value, Model):
            value = value.to_dict()
        if isinstance(value, dict):
            return ModelFactory.create(value)
        return value

    @field_validator("units", mode="before")
    @classmethod
    def _instantiate_units(cls, value: Any) -> Any:
        items = value if isinstance(value, list) else []
        instantiated: List[Unit] = []
        for item in items:
            if isinstance(item, Unit):
                instantiated.append(item)
                continue
            if not isinstance(item, dict):
                continue
            unit_type = item.get("type")
            if unit_type == "execution":
                instantiated.append(ExecutionUnit(**build_execution_unit_config(item)))
            elif unit_type == "subworkflow":
                instantiated.append(SubworkflowUnit(**item))
            else:
                instantiated.append(Unit(**item))
        return instantiated

    @classmethod
    def from_arguments(
        cls,
        application: Application,
        model: Model,
        method: Method,
        name: str,
        units: Optional[List] = None,
        config: Optional[dict] = None,
    ) -> "Subworkflow":
        if units is None:
            units = []
        if config is None:
            config = {}

        model.method = method
        return cls(name=name, application=application, model=model, units=units, **config)

    @property
    def method_data(self):
        return self.model.method.data

    def get_hash_object(self) -> dict:
        return {
            "application": self.application.calculate_hash(),
            "model": self.model.calculate_hash(),
            "units": ",".join(u.calculate_hash() for u in self.units),
        }

    def get_as_unit(self) -> Unit:
        return Unit(type="subworkflow", id=self.id, name=self.name)
