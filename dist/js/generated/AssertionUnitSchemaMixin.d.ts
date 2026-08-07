import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AssertionUnitMixinSchema, BaseInMemoryEntitySchema } from "@mat3ra/esse/dist/js/types";
export type AssertionUnitSchemaMixin = AssertionUnitMixinSchema;
export type AssertionUnitInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & AssertionUnitSchemaMixin>;
export declare function assertionUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & AssertionUnitSchemaMixin;
