import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type SubworkflowUnitSchemaMixin } from "../generated/SubworkflowUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = SubworkflowUnitSchema;
export type SubworkflowUnitConfig = Partial<Omit<Schema, "flowchartId">> & Pick<Schema, "flowchartId">;
interface SubworkflowUnit extends SubworkflowUnitSchemaMixin, Taggable {
}
declare class SubworkflowUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: SubworkflowUnitConfig);
}
export default SubworkflowUnit;
