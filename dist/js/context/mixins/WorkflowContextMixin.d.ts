import type { WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import type ContextProvider from "../providers/base/ContextProvider";
type Workflow = WorkflowSchema & {
    hasRelaxation?: boolean;
};
export type WorkflowContextMixin = {
    isEdited: boolean;
    workflow: Workflow;
    initWorkflowContextMixin(externalContext: WorkflowExternalContext): void;
};
export type WorkflowExternalContext = {
    workflow: Workflow;
};
export default function workflowContextMixin(item: ContextProvider): void;
export {};
