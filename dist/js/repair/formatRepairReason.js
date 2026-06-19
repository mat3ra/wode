"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRepairReason = formatRepairReason;
function formatRepairReason(error) {
    var _a;
    if (error && typeof error === "object") {
        const entityError = error;
        if (((_a = entityError.details) === null || _a === void 0 ? void 0 : _a.error) !== undefined) {
            return JSON.stringify(entityError.details.error);
        }
        if (typeof entityError.message === "string" && entityError.message.length > 0) {
            return entityError.message;
        }
        if (typeof entityError.code === "string" && entityError.code.length > 0) {
            return entityError.code;
        }
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
