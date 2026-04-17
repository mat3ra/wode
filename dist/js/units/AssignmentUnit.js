"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const AssignmentUnitSchemaMixin_1 = require("../generated/AssignmentUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class AssignmentUnit extends BaseUnit_1.default {
    constructor(config) {
        var _a, _b;
        const schema = {
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            operand: "X",
            value: "1",
            ...config,
            name: (_a = config.name) !== null && _a !== void 0 ? _a : enums_1.UnitType.assignment,
            flowchartId: (_b = config.flowchartId) !== null && _b !== void 0 ? _b : "",
            type: enums_1.UnitType.assignment,
        };
        super(schema);
    }
    getHashObject() {
        return { input: this.input, operand: this.operand, value: this.value };
    }
}
(0, AssignmentUnitSchemaMixin_1.assignmentUnitSchemaMixin)(AssignmentUnit.prototype);
exports.default = AssignmentUnit;
