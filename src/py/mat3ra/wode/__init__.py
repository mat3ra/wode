from mat3ra.ade.application import Application  # noqa: F401

from .mixins import FlowchartUnitsManager
from .subworkflows import Subworkflow
from .units import ExecutionUnit, SubworkflowUnit, Unit
from .workflows import Workflow

# In Pyodide (JupyterLite), the module loading order causes Application and other
# classes to not be fully defined when Workflow/Subworkflow/Unit are first created.
# Calling model_rebuild() after all imports forces Pydantic to re-resolve these references.
Unit.model_rebuild()
Subworkflow.model_rebuild()
Workflow.model_rebuild()

__all__ = [
    "Unit",
    "ExecutionUnit",
    "SubworkflowUnit",
    "Subworkflow",
    "Workflow",
    "FlowchartUnitsManager",
]
