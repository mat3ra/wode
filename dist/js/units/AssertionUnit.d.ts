import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { AssertionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AssertionUnitSchemaMixin } from "../generated/AssertionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = AssertionUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssertionUnitSchemaMixin>;
export type AssertionUnitConfig = Partial<Omit<Schema, "flowchartId">> & Pick<Schema, "flowchartId">;
declare const AssertionUnit_base: Base;
declare class AssertionUnit extends AssertionUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    constructor(config: AssertionUnitConfig);
    getHashObject(): {
        statement: string;
        errorMessage: string | undefined;
    };
}
export default AssertionUnit;
