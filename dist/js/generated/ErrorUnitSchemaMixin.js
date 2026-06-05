"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorUnitSchemaMixin = errorUnitSchemaMixin;
function errorUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get originalUnit() {
            return this.requiredProp("originalUnit");
        },
        set originalUnit(value) {
            this.setProp("originalUnit", value);
        },
        get reason() {
            return this.requiredProp("reason");
        },
        set reason(value) {
            this.setProp("reason", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
