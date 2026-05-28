import type { AssertionUnitSchema, AssignmentUnitSchema, ConditionUnitSchema, DataIOUnitSchema, MapUnitSchema, ProcessingUnitSchema, SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import { BaseUnit } from "./BaseUnit";
import { type ExecutionUnitSchema } from "./ExecutionUnit";
type UnitConfig = ExecutionUnitSchema | AssignmentUnitSchema | ConditionUnitSchema | DataIOUnitSchema | ProcessingUnitSchema | MapUnitSchema | SubworkflowUnitSchema | AssertionUnitSchema;
export declare class UnitFactory {
    static create(config: UnitConfig): BaseUnit;
}
export {};
