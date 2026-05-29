"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentUnitSchemaMixin = assignmentUnitSchemaMixin;
function assignmentUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get input() {
            return this.prop("input");
        },
        set input(value) {
            this.setProp("input", value);
        },
        get operand() {
            return this.requiredProp("operand");
        },
        set operand(value) {
            this.setProp("operand", value);
        },
        get value() {
            return this.requiredProp("value");
        },
        set value(value) {
            this.setProp("value", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
