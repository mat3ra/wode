"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processingUnitSchemaMixin = processingUnitSchemaMixin;
function processingUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get operation() {
            return this.requiredProp("operation");
        },
        set operation(value) {
            this.setProp("operation", value);
        },
        get operationType() {
            return this.requiredProp("operationType");
        },
        set operationType(value) {
            this.setProp("operationType", value);
        },
        get inputData() {
            return this.requiredProp("inputData");
        },
        set inputData(value) {
            this.setProp("inputData", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
