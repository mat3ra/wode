import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ReduceUnitSchemaMixin,
    reduceUnitSchemaMixin,
} from "../generated/ReduceUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ReduceUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ReduceUnitSchemaMixin>;

export type ReduceUnitConfig = Partial<Omit<Schema, "type" | "flowchartId">> &
    Pick<Schema, "flowchartId">;

class ReduceUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

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
