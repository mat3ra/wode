import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type IOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = DataIOUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<IOUnitSchemaMixin>;
export type IOUnitConfig = Partial<Schema>;
declare const IOUnit_base: Base;
declare class IOUnit extends IOUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    constructor(config: IOUnitConfig);
}
export default IOUnit;
