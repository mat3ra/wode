"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = workflowContextMixin;
function workflowContextMixin(item) {
    // @ts-expect-error
    const properties = {
        isEdited: false,
        initWorkflowContextMixin(externalContext) {
            this.workflow = externalContext.workflow;
            this.isEdited = false;
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
