"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowSchemaMixin = workflowSchemaMixin;
function workflowSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get properties() {
            return this.requiredProp("properties");
        },
        set properties(value) {
            this.setProp("properties", value);
        },
        get isUsingDataset() {
            return this.prop("isUsingDataset");
        },
        set isUsingDataset(value) {
            this.setProp("isUsingDataset", value);
        },
        get isMultiMaterial() {
            return this.prop("isMultiMaterial");
        },
        set isMultiMaterial(value) {
            this.setProp("isMultiMaterial", value);
        },
        get subworkflows() {
            return this.requiredProp("subworkflows");
        },
        set subworkflows(value) {
            this.setProp("subworkflows", value);
        },
        get units() {
            return this.requiredProp("units");
        },
        set units(value) {
            this.setProp("units", value);
        },
        get application() {
            return this.prop("application");
        },
        set application(value) {
            this.setProp("application", value);
        },
        get tags() {
            return this.prop("tags");
        },
        set tags(value) {
            this.setProp("tags", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
