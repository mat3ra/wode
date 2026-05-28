import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ReduceUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ReduceUnitSchemaMixin,
    reduceUnitSchemaMixin,
} from "../generated/ReduceUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = ReduceUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ReduceUnitSchemaMixin>;

export class ReduceUnit extends (BaseUnit as Base) implements Schema {
    constructor(unitName: string, mapUnit: string, input: ReduceUnitSchema["input"]) {
        super({ type: UnitType.reduce, name: unitName, mapFlowchartId: mapUnit, input });
    }
}

reduceUnitSchemaMixin(ReduceUnit.prototype);
