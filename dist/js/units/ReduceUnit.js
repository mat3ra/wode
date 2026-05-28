"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduceUnit = void 0;
const enums_1 = require("../enums");
const ReduceUnitSchemaMixin_1 = require("../generated/ReduceUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class ReduceUnit extends BaseUnit_1.BaseUnit {
    constructor(unitName, mapUnit, input) {
        super({ type: enums_1.UnitType.reduce, name: unitName, mapFlowchartId: mapUnit, input });
    }
}
exports.ReduceUnit = ReduceUnit;
(0, ReduceUnitSchemaMixin_1.reduceUnitSchemaMixin)(ReduceUnit.prototype);
