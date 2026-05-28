"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jobContextMixin;
function jobContextMixin(item) {
    // @ts-expect-error
    const properties = {
        isEdited: false,
        initJobContextMixin(externalContext) {
            this.job = externalContext.job;
            this.isEdited = false; // we always get the `defaultData` (recalculated from scratch, not persistent)
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
