import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AssertionUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type AssertionUnitSchemaMixin,
    assertionUnitSchemaMixin,
} from "../generated/AssertionUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = AssertionUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<AssertionUnitSchemaMixin>;

export class AssertionUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({
            name: UnitType.assertion,
            type: UnitType.assertion,
            statement: "true",
            errorMessage: "assertion failed",
            ...config,
        });
    }

    getHashObject() {
        return { statement: this.statement, errorMessage: this.errorMessage };
    }
}

assertionUnitSchemaMixin(AssertionUnit.prototype);
