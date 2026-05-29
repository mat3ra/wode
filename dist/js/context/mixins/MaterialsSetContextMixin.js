"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = materialsSetContextMixin;
const utils_1 = require("@mat3ra/code/dist/js/entity/set/ordered/utils");
function materialsSetContextMixin(item) {
    // @ts-expect-error
    const properties = {
        initMaterialsSetContextMixin(externalContext) {
            this.materialsSet = externalContext.materialsSet;
        },
        sortMaterialsByIndexInSet(materials = []) {
            const { materialsSet } = this;
            if (!materialsSet) {
                return materials;
            }
            // DO NOT SORT IN PLACE AS IT CHANGES THE ORDER IN `this.materials` AND HAS SIDE EFFECTS (MaterialViewer).
            return [...materials].sort((a, b) => {
                return (0, utils_1.compareEntitiesInOrderedSetForSorting)(a, b, materialsSet._id, false);
            });
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
