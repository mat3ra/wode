"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionUnit = void 0;
const enums_1 = require("../enums");
const ConditionUnitSchemaMixin_1 = require("../generated/ConditionUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class ConditionUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({
            name: enums_1.UnitType.condition,
            type: enums_1.UnitType.condition,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            then: undefined,
            else: undefined,
            statement: "true",
            maxOccurrences: 100,
            ...config,
        });
    }
    getHashObject() {
        return { statement: this.statement, maxOccurrences: this.maxOccurrences };
    }
}
exports.ConditionUnit = ConditionUnit;
(0, ConditionUnitSchemaMixin_1.conditionUnitSchemaMixin)(ConditionUnit.prototype);
