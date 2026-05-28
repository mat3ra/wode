import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type SubworkflowUnitSchemaMixin } from "../generated/SubworkflowUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = SubworkflowUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<SubworkflowUnitSchemaMixin>;
declare const SubworkflowUnit_base: Base;
export declare class SubworkflowUnit extends SubworkflowUnit_base implements Schema {
    constructor(config: Partial<Schema>);
}
export {};
