"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@mat3ra/utils");
class ContextProvider {
    constructor(contextItem, externalContext) {
        this.externalContext = externalContext;
        this.isEdited = contextItem.isEdited || false;
        if (contextItem.data) {
            this.setData(contextItem.data);
        }
    }
    setIsEdited(isEdited) {
        this.isEdited = isEdited;
    }
    getData() {
        return this.isEdited && this.data ? this.data : this.getDefaultData();
    }
    setData(data) {
        this.data = utils_1.Utils.clone.deepClone(data);
    }
    /**
     * Derive template-facing `data` from persisted `data`. Override when the template needs fields
     * that must not be stored (e.g. coordinates from symmetry point names + lattice).
     */
    // eslint-disable-next-line class-methods-use-this
    patchForRendering(data) {
        return data;
    }
    getDataForRendering() {
        return this.patchForRendering(this.getData());
    }
    getContextItemData() {
        return {
            name: this.name,
            isEdited: this.isEdited,
            data: this.getData(),
            extraData: this.extraData,
        };
    }
    getContextItemDataForRendering() {
        return {
            ...this.getContextItemData(),
            data: this.getDataForRendering(),
        };
    }
    /**
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    static findContextItem(unitContext, contextName) {
        const item = unitContext.find((item) => item.name === contextName);
        return item || {};
    }
}
exports.default = ContextProvider;
