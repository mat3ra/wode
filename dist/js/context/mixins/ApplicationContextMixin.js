"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = applicationContextMixin;
function applicationContextMixin(item) {
    // @ts-expect-error
    const properties = {
        initApplicationContextMixin(externalContext) {
            this.application = externalContext.application;
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
