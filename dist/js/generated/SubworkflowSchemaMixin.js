"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subworkflowSchemaMixin = subworkflowSchemaMixin;
function subworkflowSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get properties() {
            return this.prop("properties");
        },
        set properties(value) {
            this.setProp("properties", value);
        },
        get compute() {
            return this.prop("compute");
        },
        set compute(value) {
            this.setProp("compute", value);
        },
        get units() {
            return this.requiredProp("units");
        },
        set units(value) {
            this.setProp("units", value);
        },
        get model() {
            return this.requiredProp("model");
        },
        set model(value) {
            this.setProp("model", value);
        },
        get application() {
            return this.requiredProp("application");
        },
        set application(value) {
            this.setProp("application", value);
        },
        get isDraft() {
            return this.prop("isDraft");
        },
        set isDraft(value) {
            this.setProp("isDraft", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
