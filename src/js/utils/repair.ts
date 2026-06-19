import { EntityError } from "@mat3ra/code/dist/js/entity/in_memory";
import type {
    ConditionUnitSchema,
    ErrorUnitSchema,
    ExecutionUnitSchema,
    SubworkflowSchema,
    WorkflowBaseUnitSchema,
} from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import { UnitStatus, UnitType } from "../enums";
import Subworkflow from "../Subworkflow";
import ConditionUnit from "../units/ConditionUnit";
import ExecutionUnit from "../units/ExecutionUnit";
import type { AnyWorkflowUnitSchema } from "../units/factory";
import type { WorkflowSchema } from "../workflows/types";

function toErrorUnitSchema(
    unitData: Partial<WorkflowBaseUnitSchema>,
    error: unknown,
): ErrorUnitSchema {
    let reasonPayload: { error: unknown; json: object };

    if (error instanceof EntityError && error.details) {
        reasonPayload = {
            error: error.details.error,
            json: unitData as object,
        };
    } else if (error instanceof Error) {
        reasonPayload = {
            error: { message: error.message, name: error.name },
            json: unitData as object,
        };
    } else {
        reasonPayload = {
            error,
            json: unitData as object,
        };
    }

    return {
        results: [],
        preProcessors: [],
        postProcessors: [],
        monitors: [],
        name: unitData.name ?? UnitType.error,
        type: UnitType.error,
        status: UnitStatus.error,
        flowchartId: unitData.flowchartId ?? Utils.uuid.getUUID(),
        reason: JSON.stringify(reasonPayload),
        next: unitData.next ?? "",
        head: unitData.head ?? false,
    };
}

function repairExecutionUnit(
    unitData: Partial<ExecutionUnitSchema>,
): ExecutionUnitSchema | ErrorUnitSchema {
    try {
        return new ExecutionUnit(unitData as ExecutionUnitSchema).toJSON();
    } catch (error: unknown) {
        return toErrorUnitSchema(unitData as Partial<WorkflowBaseUnitSchema>, error);
    }
}

function repairConditionUnit(
    unitData: Partial<ConditionUnitSchema>,
): ConditionUnitSchema | ErrorUnitSchema {
    try {
        return new ConditionUnit(unitData as ConditionUnitSchema).toJSON();
    } catch (error: unknown) {
        return toErrorUnitSchema(unitData as Partial<WorkflowBaseUnitSchema>, error);
    }
}

function getSubworkflowValidationError(subworkflow: SubworkflowSchema): EntityError | Error | null {
    // Two checks, same order as the old isValid() path (construct + validate), but split so we
    // keep AJV errors when hydration would fail first:
    // 1. validateData — JSON Schema on raw persisted subworkflow (no Application/ModelFactory/units).
    //    Surfaces structured AJV errors (e.g. missing model) before the constructor runs.
    // 2. new Subworkflow().validate() — hydration (app, model, units) then schema on the instance.
    //    Catches schema-valid JSON that still cannot be built (unknown model, bad units, etc.).
    try {
        Subworkflow.validateData({ ...subworkflow });
        new Subworkflow(subworkflow).validate();
        return null;
    } catch (error: unknown) {
        if (error instanceof EntityError || error instanceof Error) {
            return error;
        }
        return new Error(String(error));
    }
}

function repairSubworkflow(subworkflowData: SubworkflowSchema): SubworkflowSchema {
    const units = subworkflowData.units.map((unit) => {
        if (unit.type === UnitType.execution) {
            return repairExecutionUnit(unit);
        }

        if (unit.type === UnitType.condition) {
            return repairConditionUnit(unit);
        }

        return unit;
    });

    return { ...subworkflowData, units };
}

export function repairWorkflow<T extends WorkflowSchema>(workflowData: T): T {
    const subworkflows = workflowData.subworkflows.map((subworkflow) => {
        return repairSubworkflow(subworkflow);
    });

    const invalidSubworkflows = subworkflows
        .map((subworkflow) => {
            const error = getSubworkflowValidationError(subworkflow);
            return error ? { subworkflow, error } : null;
        })
        .filter(
            (entry): entry is { subworkflow: SubworkflowSchema; error: EntityError | Error } =>
                entry !== null,
        );

    const units = workflowData.units.map((unit): AnyWorkflowUnitSchema => {
        const invalidEntry = invalidSubworkflows.find(
            ({ subworkflow }) => subworkflow._id === unit._id,
        );

        if (invalidEntry) {
            const { subworkflow, error } = invalidEntry;
            const errorUnit = toErrorUnitSchema(unit, error);
            const reasonPayload = {
                ...JSON.parse(errorUnit.reason),
                json: { unit, subworkflow },
            };

            return {
                ...errorUnit,
                _id: unit._id,
                name: unit.name || errorUnit.name,
                flowchartId: unit.flowchartId,
                reason: JSON.stringify(reasonPayload),
                preProcessors: unit.preProcessors || [],
                postProcessors: unit.postProcessors || [],
                monitors: unit.monitors || [],
                results: unit.results || [],
            };
        }

        return unit;
    });

    const validSubworkflows = subworkflows.filter((subworkflow) => {
        return !invalidSubworkflows.some(
            ({ subworkflow: invalid }) => invalid._id === subworkflow._id,
        );
    });

    const workflows = workflowData.workflows.map((nested) => {
        return repairWorkflow(nested as WorkflowSchema);
    });

    return {
        ...workflowData,
        subworkflows: validSubworkflows,
        workflows,
        units,
    };
}
