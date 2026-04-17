import type { AssertionUnitSchema, AssignmentUnitSchema, ConditionUnitSchema, DataIOUnitSchema, ExecutionUnitSchema, WorkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import AssertionUnit, { type AssertionUnitConfig } from "./AssertionUnit";
import AssignmentUnit, { type AssignmentUnitConfig } from "./AssignmentUnit";
import ConditionUnit, { type ConditionUnitConfig } from "./ConditionUnit";
import ExecutionUnit, { type ExecutionUnitConfig } from "./ExecutionUnit";
import IOUnit, { type IOUnitConfig } from "./IOUnit";
import MapUnit from "./MapUnit";
import ReduceUnit from "./ReduceUnit";
import SubworkflowUnit from "./SubworkflowUnit";
export type AnyWorkflowUnit = MapUnit | SubworkflowUnit | ReduceUnit;
export type AnySubworkflowUnit = ExecutionUnit | AssignmentUnit | ConditionUnit | IOUnit | AssertionUnit;
type ExcutionConfig = ExecutionUnitConfig & Pick<ExecutionUnitSchema, "type">;
type AssignmentConfig = AssignmentUnitConfig & Pick<AssignmentUnitSchema, "type">;
type ConditionConfig = ConditionUnitConfig & Pick<ConditionUnitSchema, "type">;
type IOConfig = IOUnitConfig & Pick<DataIOUnitSchema, "type">;
type AssertionConfig = AssertionUnitConfig & Pick<AssertionUnitSchema, "type">;
export declare class UnitFactory {
    static createInWorkflow(config: WorkflowUnitSchema): AnyWorkflowUnit;
    static createInSubworkflow(config: ExcutionConfig | AssignmentConfig | ConditionConfig | IOConfig | AssertionConfig): AnySubworkflowUnit;
}
export {};
