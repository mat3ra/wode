import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ConditionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ConditionUnitSchemaMixin = ConditionUnitMixinSchema;
export type ConditionUnitInMemoryEntity = InMemoryEntity & ConditionUnitSchemaMixin;
export declare function conditionUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ConditionUnitSchemaMixin;
