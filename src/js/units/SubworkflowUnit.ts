import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type SubworkflowUnitSchemaMixin,
    subworkflowUnitSchemaMixin,
} from "../generated/SubworkflowUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = SubworkflowUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<SubworkflowUnitSchemaMixin>;

export class SubworkflowUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({ name: "New Subworkflow", ...config, type: UnitType.subworkflow });
    }
}

subworkflowUnitSchemaMixin(SubworkflowUnit.prototype);
