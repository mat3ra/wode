import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ConditionUnitSchema, ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import { UnitStatus, UnitType } from "../enums";
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

    static repair(unitData: Partial<Schema>): ConditionUnitSchema | ErrorUnitSchema {
        try {
            return new ConditionUnit(unitData as Schema).toJSON();
        } catch (error: unknown) {
            return {
                results: [],
                preProcessors: [],
                postProcessors: [],
                monitors: [],
                name: unitData.name ?? UnitType.error,
                type: UnitType.error,
                status: UnitStatus.error,
                flowchartId: unitData.flowchartId ?? Utils.uuid.getUUID(),
                reason: JSON.stringify(error),
                next: unitData.next ?? "",
                head: unitData.head ?? false,
                originalUnit: unitData,
            };
        }
    }
}

conditionUnitSchemaMixin(ConditionUnit.prototype);

export default ConditionUnit;
