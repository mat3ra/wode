import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { ConditionUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ConditionUnitSchemaMixin,
    conditionUnitSchemaMixin,
} from "../generated/ConditionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ConditionUnitSchema;

export type ConditionUnitConfig = Partial<Schema>;

interface ConditionUnit extends ConditionUnitSchemaMixin, Taggable {}

class ConditionUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/condition");
    }

    constructor(config: ConditionUnitConfig) {
        const schema = {
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            then: "",
            else: "",
            statement: "true",
            maxOccurrences: 100,
            ...config,
            name: config.name ?? UnitType.condition,
            type: UnitType.condition as Schema["type"],
        };
        super(schema);
    }

    getHashObject(): object {
        return { statement: this.statement, maxOccurrences: this.maxOccurrences };
    }
}

conditionUnitSchemaMixin(ConditionUnit.prototype);

export default ConditionUnit;
