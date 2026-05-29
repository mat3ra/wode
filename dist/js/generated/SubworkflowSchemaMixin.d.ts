import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { SubworkflowMixinSchema } from "@mat3ra/esse/dist/js/types";
export type SubworkflowSchemaMixin = SubworkflowMixinSchema;
export type SubworkflowInMemoryEntity = InMemoryEntity & SubworkflowSchemaMixin;
export declare function subworkflowSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & SubworkflowSchemaMixin;
