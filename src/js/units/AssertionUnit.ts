import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AssertionUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type AssertionUnitSchemaMixin,
    assertionUnitSchemaMixin,
} from "../generated/AssertionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = AssertionUnitSchema;

export type AssertionUnitConfig = Partial<Schema>;

interface AssertionUnit extends AssertionUnitSchemaMixin, Taggable {}

class AssertionUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/assertion");
    }

    constructor(config: AssertionUnitConfig) {
        const schema = {
            name: UnitType.assertion,
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            statement: "true",
            errorMessage: "assertion failed",
            ...config,
            type: UnitType.assertion as Schema["type"],
        };
        super(schema);
    }

    getHashObject() {
        return { statement: this.statement, errorMessage: this.errorMessage };
    }
}

assertionUnitSchemaMixin(AssertionUnit.prototype);

export default AssertionUnit;
