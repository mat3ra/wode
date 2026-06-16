import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ErrorUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ErrorUnitSchemaMixin = ErrorUnitMixinSchema;
export type ErrorUnitInMemoryEntity = InMemoryEntity & ErrorUnitSchemaMixin;
export declare function errorUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ErrorUnitSchemaMixin;
