import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type AssignmentUnitSchemaMixin,
    assignmentUnitSchemaMixin,
} from "../generated/AssignmentUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = AssignmentUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssignmentUnitSchemaMixin>;

export class AssignmentUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({
            name: UnitType.assignment,
            type: UnitType.assignment,
            operand: "X",
            value: "1",
            input: [],
            ...config,
        });
    }

    getHashObject(): object {
        return { input: this.input, operand: this.operand, value: this.value };
    }
}

assignmentUnitSchemaMixin(AssignmentUnit.prototype);
