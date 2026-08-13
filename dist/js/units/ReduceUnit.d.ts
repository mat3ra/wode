import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type ReduceUnitSchemaMixin } from "../generated/ReduceUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = ReduceUnitSchema;
export type ReduceUnitConfig = Partial<Omit<Schema, "type" | "flowchartId">> & Pick<Schema, "flowchartId">;
interface ReduceUnit extends ReduceUnitSchemaMixin, Taggable {
}
declare class ReduceUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ReduceUnitConfig);
}
export default ReduceUnit;
