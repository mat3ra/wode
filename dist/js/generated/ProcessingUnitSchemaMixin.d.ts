import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ProcessingUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type ProcessingUnitSchemaMixin = ProcessingUnitMixinSchema;
export type ProcessingUnitInMemoryEntity = InMemoryEntity & ProcessingUnitSchemaMixin;
export declare function processingUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ProcessingUnitSchemaMixin;
