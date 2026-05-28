import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type IOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = DataIOUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<IOUnitSchemaMixin>;
declare const IOUnit_base: Base;
export declare class IOUnit extends IOUnit_base implements Schema {
    constructor(config: Partial<Schema>);
}
export {};
