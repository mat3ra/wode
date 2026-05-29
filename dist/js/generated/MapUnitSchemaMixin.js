"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUnitSchemaMixin = mapUnitSchemaMixin;
function mapUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get workflowId() {
            return this.requiredProp("workflowId");
        },
        set workflowId(value) {
            this.setProp("workflowId", value);
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
