"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const enums_1 = require("../enums");
const ErrorUnitSchemaMixin_1 = require("../generated/ErrorUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
class ErrorUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/error");
    }
    constructor(config) {
        var _a;
        const schema = {
            name: enums_1.UnitType.error,
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            reason: "",
            ...config,
            type: enums_1.UnitType.error,
            status: (_a = config.status) !== null && _a !== void 0 ? _a : enums_1.UnitStatus.error,
        };
        super(schema);
    }
}
(0, ErrorUnitSchemaMixin_1.errorUnitSchemaMixin)(ErrorUnit.prototype);
exports.default = ErrorUnit;
