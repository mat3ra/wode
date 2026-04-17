import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ConditionUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ConditionUnitSchemaMixin,
    conditionUnitSchemaMixin,
} from "../generated/ConditionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ConditionUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ConditionUnitSchemaMixin>;

export type ConditionUnitConfig = Partial<Schema>;

class ConditionUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    constructor(config: ConditionUnitConfig) {
        super({
            name: UnitType.condition,
            type: UnitType.condition,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            then: undefined,
            else: undefined,
            statement: "true",
            maxOccurrences: 100,
            ...config,
        });
    }

    getHashObject(): object {
        return { statement: this.statement, maxOccurrences: this.maxOccurrences };
    }
}

conditionUnitSchemaMixin(ConditionUnit.prototype);

export default ConditionUnit;
