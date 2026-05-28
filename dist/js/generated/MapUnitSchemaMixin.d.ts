import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { MapUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type MapUnitSchemaMixin = MapUnitMixinSchema;
export type MapUnitInMemoryEntity = InMemoryEntity & MapUnitSchemaMixin;
export declare function mapUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & MapUnitSchemaMixin;
