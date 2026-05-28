"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextMixin = contextMixin;
function contextMixin(item) {
    // @ts-expect-error
    const properties = {
        get context() {
            return this.requiredProp("context");
        },
        set context(ctx) {
            this.setProp("context", ctx);
        },
        renderingContext: {},
        updateRenderingContext(ctx) {
            this.context = { ...this.renderingContext, ...ctx };
        },
        getRenderingContext() {
            return this.renderingContext;
        },
        getPersistentContext() {
            return this.context;
        },
        updatePersistentContext(ctx) {
            this.context = { ...ctx };
        },
        getCombinedContext() {
            return {
                ...this.getPersistentContext(),
                ...this.getRenderingContext(),
            };
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
