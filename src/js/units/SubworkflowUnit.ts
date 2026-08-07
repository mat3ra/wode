import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type SubworkflowUnitSchemaMixin,
    subworkflowUnitSchemaMixin,
} from "../generated/SubworkflowUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = SubworkflowUnitSchema;

export type SubworkflowUnitConfig = Partial<Omit<Schema, "flowchartId">> &
    Pick<Schema, "flowchartId">;

interface SubworkflowUnit extends SubworkflowUnitSchemaMixin, Taggable {}

class SubworkflowUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/subworkflow");
    }

    constructor(config: SubworkflowUnitConfig) {
        const schema: Schema = {
            name: "New Subworkflow",
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: UnitType.subworkflow,
        };
        super(schema);
    }
}

subworkflowUnitSchemaMixin(SubworkflowUnit.prototype);

export default SubworkflowUnit;
