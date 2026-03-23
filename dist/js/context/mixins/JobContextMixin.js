"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jobContextMixin;
function jobContextMixin(item) {
    // @ts-expect-error
    const properties = {
        initJobContextMixin(externalContext) {
            this.job = externalContext.job;
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
