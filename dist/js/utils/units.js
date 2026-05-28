"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHash = calculateHash;
const enums_1 = require("../enums");
const factory_1 = require("../units/factory");
function isWorkflowLevelUnit(unit) {
    return (unit.type === enums_1.UnitType.map ||
        unit.type === enums_1.UnitType.reduce ||
        unit.type === enums_1.UnitType.subworkflow);
}
function calculateHash(unit) {
    if (isWorkflowLevelUnit(unit)) {
        return factory_1.UnitFactory.createInWorkflow(unit).calculateHash();
    }
    return factory_1.UnitFactory.createInSubworkflow(unit).calculateHash();
}
