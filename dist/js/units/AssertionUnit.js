"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionUnit = void 0;
const enums_1 = require("../enums");
const AssertionUnitSchemaMixin_1 = require("../generated/AssertionUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class AssertionUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({
            name: enums_1.UnitType.assertion,
            type: enums_1.UnitType.assertion,
            statement: "true",
            errorMessage: "assertion failed",
            ...config,
        });
    }
    getHashObject() {
        return { statement: this.statement, errorMessage: this.errorMessage };
    }
}
exports.AssertionUnit = AssertionUnit;
(0, AssertionUnitSchemaMixin_1.assertionUnitSchemaMixin)(AssertionUnit.prototype);
