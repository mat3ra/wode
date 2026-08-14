import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, ExecutionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ExecutionUnitSchemaMixin = ExecutionUnitMixinSchema;
export type ExecutionUnitInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & ExecutionUnitSchemaMixin>;
export declare function executionUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ExecutionUnitSchemaMixin;
