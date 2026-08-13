import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AssignmentUnitSchemaMixin } from "../generated/AssignmentUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = AssignmentUnitSchema;
export type AssignmentUnitConfig = Partial<Schema>;
interface AssignmentUnit extends AssignmentUnitSchemaMixin, Taggable {
}
declare class AssignmentUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: AssignmentUnitConfig);
    getHashObject(): object;
}
export default AssignmentUnit;
