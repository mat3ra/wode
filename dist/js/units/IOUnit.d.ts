import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type IOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = DataIOUnitSchema;
export type IOUnitConfig = Partial<Schema>;
interface IOUnit extends IOUnitSchemaMixin, Taggable {
}
declare class IOUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: IOUnitConfig);
}
export default IOUnit;
