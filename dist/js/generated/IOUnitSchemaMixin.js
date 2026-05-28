"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iOUnitSchemaMixin = iOUnitSchemaMixin;
function iOUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get subtype() {
            return this.requiredProp("subtype");
        },
        set subtype(value) {
            this.setProp("subtype", value);
        },
        get source() {
            return this.requiredProp("source");
        },
        set source(value) {
            this.setProp("source", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value) {
            this.setProp("input", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
