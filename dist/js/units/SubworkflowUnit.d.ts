import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type SubworkflowUnitSchemaMixin } from "../generated/SubworkflowUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = SubworkflowUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<SubworkflowUnitSchemaMixin>;
export type SubworkflowUnitConfig = Partial<Omit<Schema, "flowchartId">> & Pick<Schema, "flowchartId">;
declare const SubworkflowUnit_base: Base;
declare class SubworkflowUnit extends SubworkflowUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: SubworkflowUnitConfig);
}
export default SubworkflowUnit;
