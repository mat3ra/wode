"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = workflowContextMixin;
function workflowContextMixin(item) {
    // @ts-expect-error
    const properties = {
        initWorkflowContextMixin(externalContext) {
            this.workflow = externalContext.workflow;
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
