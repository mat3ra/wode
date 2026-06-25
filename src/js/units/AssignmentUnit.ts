import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type AssignmentUnitSchemaMixin,
    assignmentUnitSchemaMixin,
} from "../generated/AssignmentUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = AssignmentUnitSchema;

export type AssignmentUnitConfig = Partial<Schema>;

interface AssignmentUnit extends AssignmentUnitSchemaMixin, Taggable {}

class AssignmentUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/assignment");
    }

    constructor(config: AssignmentUnitConfig) {
        const schema = {
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            operand: "X",
            value: "1",
            ...config,
            name: config.name ?? UnitType.assignment,
            type: UnitType.assignment as Schema["type"],
        };
        super(schema);
    }

    getHashObject(): object {
        return { input: this.input, operand: this.operand, value: this.value };
    }
}

assignmentUnitSchemaMixin(AssignmentUnit.prototype);

export default AssignmentUnit;
