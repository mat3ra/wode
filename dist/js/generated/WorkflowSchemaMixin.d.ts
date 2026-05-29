import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseWorkflowSchema } from "@mat3ra/esse/dist/js/types";
export type WorkflowSchemaMixin = BaseWorkflowSchema;
export type WorkflowInMemoryEntity = InMemoryEntity & WorkflowSchemaMixin;
export declare function workflowSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & WorkflowSchemaMixin;
