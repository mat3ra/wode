import type { SubworkflowSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
export type SubworkflowUnitRepairRecord = {
    subworkflowId: string;
    flowchartId: string;
    reason: string;
};
export type SubworkflowRepairResult = {
    document: SubworkflowSchema;
    changed: boolean;
    repairs: SubworkflowUnitRepairRecord[];
};
export type WorkflowRepairResult = {
    document: WorkflowSchema;
    changed: boolean;
    repairs: SubworkflowUnitRepairRecord[];
};
