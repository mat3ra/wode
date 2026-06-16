import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ErrorUnitSchemaMixin } from "../generated/ErrorUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ErrorUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ErrorUnitSchemaMixin>;
export type ErrorUnitConfig = Partial<Schema>;
declare const ErrorUnit_base: Base;
declare class ErrorUnit extends ErrorUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ErrorUnitConfig);
}
export default ErrorUnit;
