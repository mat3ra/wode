"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUnitSchemaMixin = baseUnitSchemaMixin;
function baseUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get isDraft() {
            return this.prop("isDraft");
        },
        set isDraft(value) {
            this.setProp("isDraft", value);
        },
        get type() {
            return this.requiredProp("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get name() {
            return this.prop("name");
        },
        set name(value) {
            this.setProp("name", value);
        },
        get status() {
            return this.prop("status");
        },
        set status(value) {
            this.setProp("status", value);
        },
        get head() {
            return this.prop("head");
        },
        set head(value) {
            this.setProp("head", value);
        },
        get flowchartId() {
            return this.requiredProp("flowchartId");
        },
        set flowchartId(value) {
            this.setProp("flowchartId", value);
        },
        get next() {
            return this.prop("next");
        },
        set next(value) {
            this.setProp("next", value);
        },
        get enableRender() {
            return this.prop("enableRender");
        },
        set enableRender(value) {
            this.setProp("enableRender", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
