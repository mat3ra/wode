"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = methodDataContextMixin;
function methodDataContextMixin(item) {
    // @ts-expect-error
    const properties = {
        methodData: {},
        initMethodDataContextMixin(externalContext) {
            this.methodData = externalContext.methodData || {};
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
