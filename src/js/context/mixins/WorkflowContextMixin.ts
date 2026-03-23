import type { Workflow } from "../../Workflow";
import type ContextProvider from "../providers/base/ContextProvider";

export type WorkflowContextMixin = {
    workflow: Workflow;
    initWorkflowContextMixin(externalContext: WorkflowExternalContext): void;
};

export type WorkflowExternalContext = {
    workflow: Workflow;
};

export default function workflowContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & WorkflowContextMixin = {
        initWorkflowContextMixin(externalContext: WorkflowExternalContext) {
            this.workflow = externalContext.workflow;
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
