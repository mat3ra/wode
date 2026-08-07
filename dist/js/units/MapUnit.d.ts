import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { MapUnitSchema } from "@mat3ra/esse/dist/js/types";
import { UnitType } from "../enums";
import { type MapUnitSchemaMixin } from "../generated/MapUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
type Schema = MapUnitSchema;
export declare const defaultMapConfig: {
    name: UnitType;
    type: UnitType;
    workflowId: string;
    input: {
        target: string;
        scope: string;
        name: string;
        values: never[];
        useValues: boolean;
    };
    results: never[];
    monitors: never[];
    preProcessors: never[];
    postProcessors: never[];
};
export type MapUnitConfig = Partial<Omit<Schema, "type">>;
interface MapUnit extends MapUnitSchemaMixin, Taggable {
}
declare class MapUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: MapUnitConfig);
    setWorkflowId(id: string): void;
}
export default MapUnit;
