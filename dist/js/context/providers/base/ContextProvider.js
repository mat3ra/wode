"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@mat3ra/utils");
class ContextProvider {
    constructor(contextItem, externalContext) {
        this.externalContext = externalContext;
        this.extraData = contextItem.extraData;
        this.isEdited = contextItem.isEdited || false;
        this.setData(contextItem.data);
    }
    setIsEdited(isEdited) {
        this.isEdited = isEdited;
    }
    getData() {
        return this.isEdited && this.data ? this.data : this.getDefaultData();
    }
    setData(data) {
        this.data = data ? utils_1.Utils.clone.deepClone(data) : undefined;
    }
    getContextItem() {
        return {
            name: this.name,
            isEdited: this.isEdited,
            data: this.getData(),
            extraData: this.extraData,
        };
    }
}
exports.default = ContextProvider;
