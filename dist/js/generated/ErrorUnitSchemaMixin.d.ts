import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, ErrorUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ErrorUnitSchemaMixin = ErrorUnitMixinSchema;
export type ErrorUnitInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & ErrorUnitSchemaMixin>;
export declare function errorUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ErrorUnitSchemaMixin;
