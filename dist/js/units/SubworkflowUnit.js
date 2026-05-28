"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const enums_1 = require("../enums");
const SubworkflowUnitSchemaMixin_1 = require("../generated/SubworkflowUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class SubworkflowUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/subworkflow");
    }
    constructor(config) {
        const schema = {
            name: "New Subworkflow",
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            ...config,
            type: enums_1.UnitType.subworkflow,
        };
        super(schema);
    }
}
(0, SubworkflowUnitSchemaMixin_1.subworkflowUnitSchemaMixin)(SubworkflowUnit.prototype);
exports.default = SubworkflowUnit;
