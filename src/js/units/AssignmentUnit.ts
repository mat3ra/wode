import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type AssignmentUnitSchemaMixin,
    assignmentUnitSchemaMixin,
} from "../generated/AssignmentUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = AssignmentUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssignmentUnitSchemaMixin>;
export type AssignmentUnitConfig = Partial<Schema>;

class AssignmentUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    constructor(config: AssignmentUnitConfig) {
        const schema: Schema = {
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            operand: "X",
            value: "1",
            ...config,
            name: config.name ?? UnitType.assignment,
            flowchartId: config.flowchartId ?? "",
            type: UnitType.assignment,
        };
        super(schema);
    }

    getHashObject(): object {
        return { input: this.input, operand: this.operand, value: this.value };
    }
}

assignmentUnitSchemaMixin(AssignmentUnit.prototype);

export default AssignmentUnit;
