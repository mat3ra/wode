import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ReduceUnitSchemaMixin,
    reduceUnitSchemaMixin,
} from "../generated/ReduceUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ReduceUnitSchema;

export type ReduceUnitConfig = Partial<Omit<Schema, "type" | "flowchartId">> &
    Pick<Schema, "flowchartId">;

interface ReduceUnit extends ReduceUnitSchemaMixin, Taggable {}

class ReduceUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/flowchart");
    }

    constructor(config: ReduceUnitConfig) {
        const schema: Schema = {
            name: UnitType.reduce,
            mapFlowchartId: "",
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: UnitType.reduce,
        };
        super(schema);
    }
}

reduceUnitSchemaMixin(ReduceUnit.prototype);

export default ReduceUnit;
