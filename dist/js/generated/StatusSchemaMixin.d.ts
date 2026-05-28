import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { StatusSchema } from "@mat3ra/esse/dist/js/types";
export type StatusSchemaMixin = StatusSchema;
export type StatusInMemoryEntity = InMemoryEntity & StatusSchemaMixin;
export declare function statusSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & StatusSchemaMixin;
