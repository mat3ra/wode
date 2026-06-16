"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorUnitData = createErrorUnitData;
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("../enums");
function createErrorUnitData(unitData, reason) {
    const original = structuredClone(unitData);
    return {
        results: [],
        preProcessors: [],
        postProcessors: [],
        monitors: [],
        name: typeof original.name === "string" ? original.name : enums_1.UnitType.error,
        type: enums_1.UnitType.error,
        status: enums_1.UnitStatus.error,
        flowchartId: typeof original.flowchartId === "string" ? original.flowchartId : utils_1.Utils.uuid.getUUID(),
        originalUnit: original,
        reason,
        ...(typeof original._id === "string" ? { _id: original._id } : {}),
        ...(typeof original.next === "string" ? { next: original.next } : {}),
        ...(original.head === true ? { head: true } : {}),
        ...(Array.isArray(original.statusTrack) ? { statusTrack: original.statusTrack } : {}),
        ...(Array.isArray(original.tags) ? { tags: original.tags } : {}),
    };
}
