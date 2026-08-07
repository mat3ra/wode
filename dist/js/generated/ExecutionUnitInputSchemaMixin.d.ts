import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, ExecutionUnitInputItemSchema } from "@mat3ra/esse/dist/js/types";
export type ExecutionUnitInputSchemaMixin = ExecutionUnitInputItemSchema;
export type ExecutionUnitInputInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & ExecutionUnitInputSchemaMixin>;
export declare function executionUnitInputSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ExecutionUnitInputSchemaMixin;
