import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { MapUnitSchema } from "@mat3ra/esse/dist/js/types";
import { UnitType } from "../enums";
import { type MapUnitSchemaMixin } from "../generated/MapUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = MapUnitSchema;
export declare const defaultMapConfig: {
    name: string;
    type: UnitType.map;
    workflowId: string;
    input: {
        target: string;
        scope: string;
        name: string;
        values: never[];
        useValues: boolean;
    };
};
type Base = typeof BaseUnit<Schema> & Constructor<MapUnitSchemaMixin>;
declare const MapUnit_base: Base;
export declare class MapUnit extends MapUnit_base implements Schema {
    constructor(config: Partial<Schema>);
    setWorkflowId(id: string): void;
}
export {};
