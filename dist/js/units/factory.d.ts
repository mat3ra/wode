import type { ApplicationSchema, AssertionUnitSchema, AssignmentUnitSchema, ConditionUnitSchema, DataIOUnitSchema, ErrorUnitSchema, ExecutionUnitSchema, MapUnitSchema, ReduceUnitSchema, SubworkflowUnitSchema, WorkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import AssertionUnit, { type AssertionUnitConfig } from "./AssertionUnit";
import AssignmentUnit, { type AssignmentUnitConfig } from "./AssignmentUnit";
import ConditionUnit, { type ConditionUnitConfig } from "./ConditionUnit";
import ErrorUnit, { type ErrorUnitConfig } from "./ErrorUnit";
import ExecutionUnit, { type ExecutionUnitConfig } from "./ExecutionUnit";
import IOUnit, { type IOUnitConfig } from "./IOUnit";
import MapUnit from "./MapUnit";
import ReduceUnit from "./ReduceUnit";
import SubworkflowUnit from "./SubworkflowUnit";
export type AnyWorkflowUnit = MapUnit | SubworkflowUnit | ReduceUnit | ErrorUnit;
export type AnyWorkflowUnitSchema = MapUnitSchema | SubworkflowUnitSchema | ReduceUnitSchema | ErrorUnitSchema;
export type AnySubworkflowUnit = ExecutionUnit | AssignmentUnit | ConditionUnit | IOUnit | AssertionUnit | ErrorUnit;
export type AnySubworkflowUnitSchema = ExecutionUnitSchema | AssertionUnitSchema | AssignmentUnitSchema | ConditionUnitSchema | DataIOUnitSchema | ErrorUnitSchema;
type ExcutionConfig = ExecutionUnitConfig & Pick<ExecutionUnitSchema, "type">;
type AssignmentConfig = AssignmentUnitConfig & Pick<AssignmentUnitSchema, "type">;
type ConditionConfig = ConditionUnitConfig & Pick<ConditionUnitSchema, "type">;
type IOConfig = IOUnitConfig & Pick<DataIOUnitSchema, "type">;
type AssertionConfig = AssertionUnitConfig & Pick<AssertionUnitSchema, "type">;
type ErrorConfig = ErrorUnitConfig & Pick<ErrorUnitSchema, "type">;
/** Subworkflow unit kinds supported by {@link UnitFactory.createDefaultSubworkflowUnit}. */
export type DefaultSubworkflowUnitType = "execution" | "assignment" | "condition" | "io" | "assertion";
export declare class UnitFactory {
    /**
     * Create a new subworkflow unit with fresh `flowchartId` and constructor defaults.
     * For execution units, pass the subworkflow (or parent) `application` JSON.
     */
    static createDefaultSubworkflowUnit(type: "execution", application: ApplicationSchema): ExecutionUnit;
    static createDefaultSubworkflowUnit(type: "assignment"): AssignmentUnit;
    static createDefaultSubworkflowUnit(type: "condition"): ConditionUnit;
    static createDefaultSubworkflowUnit(type: "io"): IOUnit;
    static createDefaultSubworkflowUnit(type: "assertion"): AssertionUnit;
    static createInWorkflow(config: WorkflowUnitSchema): AnyWorkflowUnit;
    static createInSubworkflow(config: ExcutionConfig | AssignmentConfig | ConditionConfig | IOConfig | AssertionConfig | ErrorConfig): AnySubworkflowUnit;
}
export {};
