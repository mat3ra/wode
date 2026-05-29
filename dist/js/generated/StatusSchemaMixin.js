"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchemaMixin = statusSchemaMixin;
function statusSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get status() {
            return this.prop("status");
        },
        set status(value) {
            this.setProp("status", value);
        },
        get statusTrack() {
            return this.prop("statusTrack");
        },
        set statusTrack(value) {
            this.setProp("statusTrack", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
