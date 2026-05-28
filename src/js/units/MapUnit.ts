import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { MapUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { type MapUnitSchemaMixin, mapUnitSchemaMixin } from "../generated/MapUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = MapUnitSchema;

export const defaultMapConfig = {
    name: UnitType.map as string,
    type: UnitType.map as const,
    workflowId: "",
    input: {
        target: "MAP_DATA",
        scope: "global",
        name: "",
        values: [],
        useValues: false,
    },
};

type Base = typeof BaseUnit<Schema> & Constructor<MapUnitSchemaMixin>;

export class MapUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({ ...defaultMapConfig, ...config });
    }

    setWorkflowId(id: string) {
        this.setProp("workflowId", id);
    }
}

mapUnitSchemaMixin(MapUnit.prototype);
