import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { SubworkflowUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type SubworkflowUnitSchemaMixin = SubworkflowUnitMixinSchema;
export type SubworkflowUnitInMemoryEntity = InMemoryEntity & SubworkflowUnitSchemaMixin;
export declare function subworkflowUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & SubworkflowUnitSchemaMixin;
