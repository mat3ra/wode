import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ErrorUnitSchemaMixin } from "../generated/ErrorUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ErrorUnitSchema;
export type ErrorUnitConfig = Partial<Schema>;
interface ErrorUnit extends ErrorUnitSchemaMixin, Taggable {
}
declare class ErrorUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ErrorUnitConfig);
}
export default ErrorUnit;
