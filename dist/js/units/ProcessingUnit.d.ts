import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ProcessingUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ProcessingUnitSchemaMixin } from "../generated/ProcessingUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = ProcessingUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ProcessingUnitSchemaMixin>;
declare const ProcessingUnit_base: Base;
export declare class ProcessingUnit extends ProcessingUnit_base implements Schema {
    constructor(config: Partial<Schema>);
    setOperation(op: ProcessingUnitSchema["operation"]): void;
    setOperationType(type: ProcessingUnitSchema["operationType"]): void;
    setInput(input: ProcessingUnitSchema["inputData"]): void;
}
export {};
