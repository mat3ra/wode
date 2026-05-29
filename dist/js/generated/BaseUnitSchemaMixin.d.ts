import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { WorkflowBaseUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type BaseUnitSchemaMixin = WorkflowBaseUnitMixinSchema;
export type BaseUnitInMemoryEntity = InMemoryEntity & BaseUnitSchemaMixin;
export declare function baseUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & BaseUnitSchemaMixin;
