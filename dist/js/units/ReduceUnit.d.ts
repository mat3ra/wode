import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ReduceUnitSchemaMixin } from "../generated/ReduceUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = ReduceUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ReduceUnitSchemaMixin>;
declare const ReduceUnit_base: Base;
export declare class ReduceUnit extends ReduceUnit_base implements Schema {
    constructor(unitName: string, mapUnit: string, input: ReduceUnitSchema["input"]);
}
export {};
