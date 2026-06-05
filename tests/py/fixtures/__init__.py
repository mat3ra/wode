from typing import Any, Dict

from mat3ra.standata.workflows import WorkflowStandata

WORKFLOW_STANDATA = WorkflowStandata()


def get_execution_unit_config_by_application_workflow_unit(application: str, workflow_name: str, unit_name: str) -> \
Dict[str, Any]:
    workflows = WORKFLOW_STANDATA.get_by_categories(application, workflow_name)
    if not workflows:
        raise ValueError(f"No workflow {workflow_name!r} for application {application!r}")
    for subworkflow in workflows[0]["subworkflows"]:
        for unit in subworkflow["units"]:
            if unit.get("type") == "execution" and unit.get("name") == unit_name:
                return unit
    raise ValueError(f"No execution unit {unit_name!r} in workflow {workflow_name!r}")
