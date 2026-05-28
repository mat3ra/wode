"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionUnitInputSchemaMixin = executionUnitInputSchemaMixin;
function executionUnitInputSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get template() {
            return this.requiredProp("template");
        },
        set template(value) {
            this.setProp("template", value);
        },
        get rendered() {
            return this.requiredProp("rendered");
        },
        set rendered(value) {
            this.setProp("rendered", value);
        },
        get isManuallyChanged() {
            return this.requiredProp("isManuallyChanged");
        },
        set isManuallyChanged(value) {
            this.setProp("isManuallyChanged", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
