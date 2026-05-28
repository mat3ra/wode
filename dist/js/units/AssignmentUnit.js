"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentUnit = void 0;
const enums_1 = require("../enums");
const AssignmentUnitSchemaMixin_1 = require("../generated/AssignmentUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class AssignmentUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({
            name: enums_1.UnitType.assignment,
            type: enums_1.UnitType.assignment,
            operand: "X",
            value: "1",
            input: [],
            ...config,
        });
    }
    getHashObject() {
        return { input: this.input, operand: this.operand, value: this.value };
    }
}
exports.AssignmentUnit = AssignmentUnit;
(0, AssignmentUnitSchemaMixin_1.assignmentUnitSchemaMixin)(AssignmentUnit.prototype);
