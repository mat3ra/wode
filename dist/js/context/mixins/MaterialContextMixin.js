"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = materialContextMixin;
function materialContextMixin(item) {
    // @ts-expect-error
    const properties = {
        updateMaterialHash() {
            this.extraData = { materialHash: this.material.hash };
        },
        initMaterialContextMixin(externalContext) {
            this.material = externalContext.material;
            this.updateMaterialHash();
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
