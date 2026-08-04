import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, StatusTrackSchema } from "@mat3ra/esse/dist/js/types";
export type StatusTrackSchemaMixin = StatusTrackSchema;
export type StatusTrackInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & StatusTrackSchemaMixin>;
export declare function statusTrackSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & StatusTrackSchemaMixin;
