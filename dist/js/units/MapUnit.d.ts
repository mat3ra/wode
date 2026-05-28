import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
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
type Base = typeof BaseUnit<Schema> & Constructor<MapUnitSchemaMixin>;
export type MapUnitConfig = Partial<Omit<Schema, "type">>;
declare const MapUnit_base: Base;
declare class MapUnit extends MapUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: MapUnitConfig);
    setWorkflowId(id: string): void;
}
export default MapUnit;
