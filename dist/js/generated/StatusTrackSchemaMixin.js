"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusTrackSchemaMixin = statusTrackSchemaMixin;
function statusTrackSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get statusTrack() {
            return this.prop("statusTrack");
        },
        set statusTrack(value) {
            this.setProp("statusTrack", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
