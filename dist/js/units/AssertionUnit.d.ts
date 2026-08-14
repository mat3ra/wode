import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { AssertionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AssertionUnitSchemaMixin } from "../generated/AssertionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = AssertionUnitSchema;
export type AssertionUnitConfig = Partial<Schema>;
interface AssertionUnit extends AssertionUnitSchemaMixin, Taggable {
}
declare class AssertionUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: AssertionUnitConfig);
    getHashObject(): {
        statement: string;
        errorMessage: string | undefined;
    };
}
export default AssertionUnit;
