"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const enums_1 = require("../enums");
const ReduceUnitSchemaMixin_1 = require("../generated/ReduceUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class ReduceUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/flowchart");
    }
    constructor(config) {
        const schema = {
            name: enums_1.UnitType.reduce,
            mapFlowchartId: "",
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: enums_1.UnitType.reduce,
        };
        super(schema);
    }
}
(0, ReduceUnitSchemaMixin_1.reduceUnitSchemaMixin)(ReduceUnit.prototype);
exports.default = ReduceUnit;
