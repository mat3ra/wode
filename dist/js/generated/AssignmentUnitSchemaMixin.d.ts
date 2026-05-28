import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AssignmentUnitMixinSchema } from "@mat3ra/esse/dist/js/types";
export type AssignmentUnitSchemaMixin = AssignmentUnitMixinSchema;
export type AssignmentUnitInMemoryEntity = InMemoryEntity & AssignmentUnitSchemaMixin;
export declare function assignmentUnitSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & AssignmentUnitSchemaMixin;
