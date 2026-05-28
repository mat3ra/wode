import type {
    AssertionUnitSchema,
    AssignmentUnitSchema,
    ConditionUnitSchema,
    DataIOUnitSchema,
    MapUnitSchema,
    ProcessingUnitSchema,
    SubworkflowUnitSchema,
} from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { AssertionUnit } from "./AssertionUnit";
import { AssignmentUnit } from "./AssignmentUnit";
import { BaseUnit } from "./BaseUnit";
import { ConditionUnit } from "./ConditionUnit";
import { type ExecutionUnitSchema, ExecutionUnit } from "./ExecutionUnit";
import { IOUnit } from "./IOUnit";
import { MapUnit } from "./MapUnit";
import { ProcessingUnit } from "./ProcessingUnit";
import { SubworkflowUnit } from "./SubworkflowUnit";

type UnitConfig =
    | ExecutionUnitSchema
    | AssignmentUnitSchema
    | ConditionUnitSchema
    | DataIOUnitSchema
    | ProcessingUnitSchema
    | MapUnitSchema
    | SubworkflowUnitSchema
    | AssertionUnitSchema;

export class UnitFactory {
    static create(config: UnitConfig): BaseUnit {
        switch (config.type) {
            case UnitType.execution:
                return new ExecutionUnit(config);
            case UnitType.assignment:
                return new AssignmentUnit(config);
            case UnitType.condition:
                return new ConditionUnit(config);
            case UnitType.io:
                return new IOUnit(config);
            case UnitType.processing:
                return new ProcessingUnit(config);
            case UnitType.map:
                return new MapUnit(config);
            case UnitType.subworkflow:
                return new SubworkflowUnit(config);
            case UnitType.assertion:
                return new AssertionUnit(config);
            default:
                throw new Error(`Unknown unit type: ${config.type}`);
        }
    }
}
