"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const enums_1 = require("../enums");
const ConditionUnitSchemaMixin_1 = require("../generated/ConditionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class ConditionUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/condition");
    }
    constructor(config) {
        var _a;
        const schema = {
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            then: "",
            else: "",
            statement: "true",
            maxOccurrences: 100,
            ...config,
            name: (_a = config.name) !== null && _a !== void 0 ? _a : enums_1.UnitType.condition,
            type: enums_1.UnitType.condition,
        };
        super(schema);
    }
    getHashObject() {
        return { statement: this.statement, maxOccurrences: this.maxOccurrences };
    }
    static repair(unitData) {
        return BaseUnit_1.default.repairUnit(ConditionUnit, unitData);
    }
}
(0, ConditionUnitSchemaMixin_1.conditionUnitSchemaMixin)(ConditionUnit.prototype);
exports.default = ConditionUnit;
