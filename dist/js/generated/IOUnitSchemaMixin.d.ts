import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { DataIOUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type IOUnitSchemaMixin = DataIOUnitMixinSchema;
export type IOUnitInMemoryEntity = InMemoryEntity & IOUnitSchemaMixin;
export declare function iOUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & IOUnitSchemaMixin;
