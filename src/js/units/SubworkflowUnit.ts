import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { SubworkflowUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type SubworkflowUnitSchemaMixin,
    subworkflowUnitSchemaMixin,
} from "../generated/SubworkflowUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = SubworkflowUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<SubworkflowUnitSchemaMixin>;

export type SubworkflowUnitConfig = Partial<Omit<Schema, "flowchartId">> &
    Pick<Schema, "flowchartId">;

class SubworkflowUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/subworkflow");
    }

    constructor(config: SubworkflowUnitConfig) {
        const schema: Schema = {
            name: "New Subworkflow",
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: UnitType.subworkflow,
        };
        super(schema);
    }
}

subworkflowUnitSchemaMixin(SubworkflowUnit.prototype);

export default SubworkflowUnit;
