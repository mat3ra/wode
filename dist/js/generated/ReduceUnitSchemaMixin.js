"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceUnitSchemaMixin = reduceUnitSchemaMixin;
function reduceUnitSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.prop("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get mapFlowchartId() {
            return this.requiredProp("mapFlowchartId");
        },
        set mapFlowchartId(value) {
            this.setProp("mapFlowchartId", value);
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
