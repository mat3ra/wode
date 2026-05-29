import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ReduceUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ReduceUnitSchemaMixin = ReduceUnitMixinSchema;
export type ReduceUnitInMemoryEntity = InMemoryEntity & ReduceUnitSchemaMixin;
export declare function reduceUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ReduceUnitSchemaMixin;
