"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertionUnitSchemaMixin = assertionUnitSchemaMixin;
function assertionUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get statement() {
            return this.requiredProp("statement");
        },
        set statement(value) {
            this.setProp("statement", value);
        },
        get errorMessage() {
            return this.prop("errorMessage");
        },
        set errorMessage(value) {
            this.setProp("errorMessage", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
