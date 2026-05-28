"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subworkflowUnitSchemaMixin = subworkflowUnitSchemaMixin;
function subworkflowUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
