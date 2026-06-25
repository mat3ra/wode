import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { MapUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import { type MapUnitSchemaMixin, mapUnitSchemaMixin } from "../generated/MapUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = MapUnitSchema;

export const defaultMapConfig = {
    name: UnitType.map,
    type: UnitType.map,
    workflowId: "",
    input: {
        target: "MAP_DATA",
        scope: "global",
        name: "",
        values: [],
        useValues: false,
    },
    results: [],
    monitors: [],
    preProcessors: [],
    postProcessors: [],
};
export type MapUnitConfig = Partial<Omit<Schema, "type">>;

interface MapUnit extends MapUnitSchemaMixin, Taggable {}

class MapUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/flowchart");
    }

    constructor(config: MapUnitConfig) {
        const schema: Schema = {
            ...defaultMapConfig,
            ...config,
            flowchartId: config.flowchartId ?? "",
            type: UnitType.map,
        };
        super(schema);
    }

    setWorkflowId(id: string) {
        this.workflowId = id;
    }
}

mapUnitSchemaMixin(MapUnit.prototype);

export default MapUnit;
