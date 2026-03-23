import type { Workflow } from "../../Workflow";
import type ContextProvider from "../providers/base/ContextProvider";
export type WorkflowContextMixin = {
    workflow: Workflow;
    initWorkflowContextMixin(externalContext: WorkflowExternalContext): void;
};
export type WorkflowExternalContext = {
    workflow: Workflow;
};
export default function workflowContextMixin(item: ContextProvider): void;
