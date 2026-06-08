import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ConditionUnitSchema, ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ConditionUnitSchemaMixin } from "../generated/ConditionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ConditionUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ConditionUnitSchemaMixin>;
export type ConditionUnitConfig = Partial<Schema>;
declare const ConditionUnit_base: Base;
declare class ConditionUnit extends ConditionUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ConditionUnitConfig);
    getHashObject(): object;
    static repair(unitData: Partial<Schema>): ConditionUnitSchema | ErrorUnitSchema;
}
export default ConditionUnit;
