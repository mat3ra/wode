"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = materialsContextMixin;
function materialsContextMixin(item) {
    // @ts-expect-error
    const properties = {
        materials: [],
        initMaterialsContextMixin(externalContext) {
            this.materials = externalContext.materials;
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
