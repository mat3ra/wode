"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const enums_1 = require("../enums");
const AssertionUnitSchemaMixin_1 = require("../generated/AssertionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class AssertionUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/assertion");
    }
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
