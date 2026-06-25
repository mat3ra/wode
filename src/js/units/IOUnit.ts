import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { type IOUnitSchemaMixin, iOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = DataIOUnitSchema;

export type IOUnitConfig = Partial<Schema>;

interface IOUnit extends IOUnitSchemaMixin, Taggable {}

class IOUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/io");
    }

    constructor(config: IOUnitConfig) {
        const schema = {
            name: UnitType.io,
            subtype: "input" as const,
            source: "api" as const,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: UnitType.io as Schema["type"],
        };
        super(schema);
    }
}

iOUnitSchemaMixin(IOUnit.prototype);

export default IOUnit;
