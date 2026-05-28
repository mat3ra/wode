"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = methodDataContextMixin;
function methodDataContextMixin(item) {
    // @ts-expect-error
    const properties = {
        methodData: {},
        isEdited: false,
        initMethodDataContextMixin(externalContext) {
            this.methodData = externalContext.methodData || {};
            this.isEdited = Boolean(externalContext === null || externalContext === void 0 ? void 0 : externalContext.isEdited);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
