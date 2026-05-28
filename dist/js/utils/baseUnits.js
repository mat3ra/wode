"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStatus = resetStatus;
const enums_1 = require("../enums");
function resetStatus(unit) {
    return {
        ...unit,
        status: enums_1.UnitStatus.idle,
        statusTrack: [],
    };
}
