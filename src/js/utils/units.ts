import type { SubworkflowSchema, WorkflowUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { UnitFactory } from "../units/factory";

type SubworkflowUnitSchema = SubworkflowSchema["units"][number];

function isWorkflowLevelUnit(
    unit: WorkflowUnitSchema | SubworkflowUnitSchema,
): unit is WorkflowUnitSchema {
    return (
        unit.type === UnitType.map ||
        unit.type === UnitType.reduce ||
        unit.type === UnitType.subworkflow
    );
}

export function calculateHash(unit: WorkflowUnitSchema | SubworkflowUnitSchema): string {
    if (isWorkflowLevelUnit(unit)) {
        return UnitFactory.createInWorkflow(unit).calculateHash();
    }
    return UnitFactory.createInSubworkflow(unit).calculateHash();
}
