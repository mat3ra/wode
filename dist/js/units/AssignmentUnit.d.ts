import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AssignmentUnitSchemaMixin } from "../generated/AssignmentUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = AssignmentUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssignmentUnitSchemaMixin>;
export type AssignmentUnitConfig = Partial<Schema>;
declare const AssignmentUnit_base: Base;
declare class AssignmentUnit extends AssignmentUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: AssignmentUnitConfig);
    getHashObject(): object;
}
export default AssignmentUnit;
