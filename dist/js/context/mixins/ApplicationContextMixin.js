"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationContextMixin = applicationContextMixin;
const settings_1 = require("../providers/settings");
function applicationContextMixin(item) {
    // @ts-expect-error
    const properties = {
        initApplicationContextMixin(externalContext) {
            var _a;
            this.application =
                (_a = externalContext.application) !== null && _a !== void 0 ? _a : settings_1.globalSettings.Application.createDefault();
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
