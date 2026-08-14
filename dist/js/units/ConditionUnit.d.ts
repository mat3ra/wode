import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { ConditionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ConditionUnitSchemaMixin } from "../generated/ConditionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ConditionUnitSchema;
export type ConditionUnitConfig = Partial<Schema>;
interface ConditionUnit extends ConditionUnitSchemaMixin, Taggable {
}
declare class ConditionUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ConditionUnitConfig);
    getHashObject(): object;
}
export default ConditionUnit;
