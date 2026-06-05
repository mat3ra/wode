import type {
    AssertionUnitSchema,
    AssignmentUnitSchema,
    ConditionUnitSchema,
    DataIOUnitSchema,
    ErrorUnitSchema,
    ExecutionUnitSchema,
    MapUnitSchema,
    ReduceUnitSchema,
    SubworkflowUnitSchema,
    WorkflowUnitSchema,
} from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import AssertionUnit, { type AssertionUnitConfig } from "./AssertionUnit";
import AssignmentUnit, { type AssignmentUnitConfig } from "./AssignmentUnit";
import ConditionUnit, { type ConditionUnitConfig } from "./ConditionUnit";
import ErrorUnit, { type ErrorUnitConfig } from "./ErrorUnit";
import ExecutionUnit, { type ExecutionUnitConfig } from "./ExecutionUnit";
import IOUnit, { type IOUnitConfig } from "./IOUnit";
import MapUnit from "./MapUnit";
import ReduceUnit from "./ReduceUnit";
import SubworkflowUnit from "./SubworkflowUnit";

export type AnyWorkflowUnit = MapUnit | SubworkflowUnit | ReduceUnit;

export type AnyWorkflowUnitSchema = MapUnitSchema | SubworkflowUnitSchema | ReduceUnitSchema;

export type AnySubworkflowUnit =
    | ExecutionUnit
    | AssignmentUnit
    | ConditionUnit
    | IOUnit
    | AssertionUnit
    | ErrorUnit;

export type AnySubworkflowUnitSchema =
    | ExecutionUnitSchema
    | AssertionUnitSchema
    | AssignmentUnitSchema
    | ConditionUnitSchema
    | DataIOUnitSchema
    | ErrorUnitSchema;

type ExcutionConfig = ExecutionUnitConfig & Pick<ExecutionUnitSchema, "type">;
type AssignmentConfig = AssignmentUnitConfig & Pick<AssignmentUnitSchema, "type">;
type ConditionConfig = ConditionUnitConfig & Pick<ConditionUnitSchema, "type">;
type IOConfig = IOUnitConfig & Pick<DataIOUnitSchema, "type">;
type AssertionConfig = AssertionUnitConfig & Pick<AssertionUnitSchema, "type">;
type ErrorConfig = ErrorUnitConfig & Pick<ErrorUnitSchema, "type">;

/** Subworkflow unit kinds supported by {@link UnitFactory.createDefaultSubworkflowUnit}. */
export type DefaultSubworkflowUnitType =
    | "execution"
    | "assignment"
    | "condition"
    | "io"
    | "assertion";

export class UnitFactory {
    /**
     * Create a new subworkflow unit with fresh `flowchartId` and constructor defaults.
     * For execution units, pass the subworkflow (or parent) `application` JSON.
     */
    static createDefaultSubworkflowUnit(
        type: "execution",
        application: ExecutionUnitSchema["application"],
    ): AnySubworkflowUnit;

    static createDefaultSubworkflowUnit(
        type: "assignment" | "condition" | "io" | "assertion",
    ): AnySubworkflowUnit;

    static createDefaultSubworkflowUnit(
        type: DefaultSubworkflowUnitType,
        application?: ExecutionUnitSchema["application"],
    ): AnySubworkflowUnit {
        if (type === "execution") {
            if (application === undefined) {
                throw new Error(
                    "UnitFactory.createDefaultSubworkflowUnit: application is required when type is execution",
                );
            }
            return new ExecutionUnit({
                type: UnitType.execution,
                application,
            });
        }
        switch (type) {
            case "assignment":
                return new AssignmentUnit({ type: UnitType.assignment });
            case "condition":
                return new ConditionUnit({ type: UnitType.condition });
            case "io":
                return new IOUnit({ type: UnitType.io });
            case "assertion":
                return new AssertionUnit({ type: UnitType.assertion });
            default: {
                const unreachable: never = type;
                throw new Error(`Unexpected unit type: ${String(unreachable)}`);
            }
        }
    }

    static createInWorkflow(config: WorkflowUnitSchema): AnyWorkflowUnit {
        switch (config.type) {
            case UnitType.map:
                return new MapUnit(config);
            case UnitType.subworkflow:
                return new SubworkflowUnit(config);
            case UnitType.reduce:
                return new ReduceUnit(config);
            default:
                throw new Error(`Unknown unit type: ${config.type}`);
        }
    }

    static createInSubworkflow(
        config:
            | ExcutionConfig
            | AssignmentConfig
            | ConditionConfig
            | IOConfig
            | AssertionConfig
            | ErrorConfig,
    ): AnySubworkflowUnit {
        switch (config.type) {
            case UnitType.execution:
                return new ExecutionUnit(config);
            case UnitType.assignment:
                return new AssignmentUnit(config);
            case UnitType.condition:
                return new ConditionUnit(config);
            case UnitType.io:
                return new IOUnit(config);
            case UnitType.assertion:
                return new AssertionUnit(config);
            case UnitType.error:
                return new ErrorUnit(config);
            default:
                throw new Error(`Unknown unit type: ${config.type}`);
        }
    }
}
