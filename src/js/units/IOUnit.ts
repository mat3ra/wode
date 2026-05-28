import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { type IOUnitSchemaMixin, iOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = DataIOUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<IOUnitSchemaMixin>;

export class IOUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({ name: UnitType.io, subtype: "input", ...config, type: UnitType.io });
    }
}

iOUnitSchemaMixin(IOUnit.prototype);
