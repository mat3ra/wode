import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ReduceUnitSchemaMixin } from "../generated/ReduceUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ReduceUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ReduceUnitSchemaMixin>;
export type ReduceUnitConfig = Partial<Omit<Schema, "type" | "flowchartId">> & Pick<Schema, "flowchartId">;
declare const ReduceUnit_base: Base;
declare class ReduceUnit extends ReduceUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ReduceUnitConfig);
}
export default ReduceUnit;
