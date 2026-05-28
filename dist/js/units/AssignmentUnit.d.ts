import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AssignmentUnitSchemaMixin } from "../generated/AssignmentUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = AssignmentUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssignmentUnitSchemaMixin>;
declare const AssignmentUnit_base: Base;
export declare class AssignmentUnit extends AssignmentUnit_base implements Schema {
    constructor(config: Partial<Schema>);
    getHashObject(): object;
}
export {};
