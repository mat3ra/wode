"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionUnitSchemaMixin = conditionUnitSchemaMixin;
function conditionUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value) {
            this.setProp("input", value);
        },
        get statement() {
            return this.requiredProp("statement");
        },
        set statement(value) {
            this.setProp("statement", value);
        },
        get then() {
            return this.requiredProp("then");
        },
        set then(value) {
            this.setProp("then", value);
        },
        get else() {
            return this.requiredProp("else");
        },
        set else(value) {
            this.setProp("else", value);
        },
        get maxOccurrences() {
            return this.requiredProp("maxOccurrences");
        },
        set maxOccurrences(value) {
            this.setProp("maxOccurrences", value);
        },
        get throwException() {
            return this.prop("throwException");
        },
        set throwException(value) {
            this.setProp("throwException", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
