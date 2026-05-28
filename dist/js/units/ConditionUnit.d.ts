import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ConditionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ConditionUnitSchemaMixin } from "../generated/ConditionUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = ConditionUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ConditionUnitSchemaMixin>;
declare const ConditionUnit_base: Base;
export declare class ConditionUnit extends ConditionUnit_base implements Schema {
    constructor(config: Partial<Schema>);
    getHashObject(): object;
}
export {};
