"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionUnitSchemaMixin = executionUnitSchemaMixin;
function executionUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.requiredProp("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get application() {
            return this.requiredProp("application");
        },
        set application(value) {
            this.setProp("application", value);
        },
        get executable() {
            return this.requiredProp("executable");
        },
        set executable(value) {
            this.setProp("executable", value);
        },
        get flavor() {
            return this.requiredProp("flavor");
        },
        set flavor(value) {
            this.setProp("flavor", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value) {
            this.setProp("input", value);
        },
        get context() {
            return this.requiredProp("context");
        },
        set context(value) {
            this.setProp("context", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
