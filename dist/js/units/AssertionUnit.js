"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const AssertionUnitSchemaMixin_1 = require("../generated/AssertionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class AssertionUnit extends BaseUnit_1.default {
    constructor(config) {
        const schema = {
            name: enums_1.UnitType.assertion,
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            statement: "true",
            errorMessage: "assertion failed",
            ...config,
            type: enums_1.UnitType.assertion,
        };
        super(schema);
    }
    getHashObject() {
        return { statement: this.statement, errorMessage: this.errorMessage };
    }
}
(0, AssertionUnitSchemaMixin_1.assertionUnitSchemaMixin)(AssertionUnit.prototype);
exports.default = AssertionUnit;
