import type { SubworkflowSchema, WorkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
type SubworkflowUnitSchema = SubworkflowSchema["units"][number];
export declare function calculateHash(unit: WorkflowUnitSchema | SubworkflowUnitSchema): string;
export {};
