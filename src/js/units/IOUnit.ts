import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { DataIOUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { type IOUnitSchemaMixin, iOUnitSchemaMixin } from "../generated/IOUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = DataIOUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<IOUnitSchemaMixin>;

export type IOUnitConfig = Partial<Omit<Schema, "flowchartId">> & Pick<Schema, "flowchartId">;

class IOUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    constructor(config: IOUnitConfig) {
        const schema: Schema = {
            name: UnitType.io,
            subtype: "input" as const,
            source: "api" as const,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: UnitType.io,
        };
        super(schema);
    }
}

iOUnitSchemaMixin(IOUnit.prototype);

export default IOUnit;
