"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const utils_1 = require("@mat3ra/utils");
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
        var _a, _b, _c, _d;
        try {
            return new ConditionUnit(unitData).toJSON();
        }
        catch (error) {
            return {
                results: [],
                preProcessors: [],
                postProcessors: [],
                monitors: [],
                name: (_a = unitData.name) !== null && _a !== void 0 ? _a : enums_1.UnitType.error,
                type: enums_1.UnitType.error,
                status: enums_1.UnitStatus.error,
                flowchartId: (_b = unitData.flowchartId) !== null && _b !== void 0 ? _b : utils_1.Utils.uuid.getUUID(),
                reason: JSON.stringify(error),
                next: (_c = unitData.next) !== null && _c !== void 0 ? _c : "",
                head: (_d = unitData.head) !== null && _d !== void 0 ? _d : false,
                originalUnit: unitData,
            };
        }
    }
}
(0, ConditionUnitSchemaMixin_1.conditionUnitSchemaMixin)(ConditionUnit.prototype);
exports.default = ConditionUnit;
