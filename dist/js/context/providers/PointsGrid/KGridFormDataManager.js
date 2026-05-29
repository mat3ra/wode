"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const PointsGridFormDataProvider_1 = __importDefault(require("./PointsGridFormDataProvider"));
class KGridFormDataManager extends PointsGridFormDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext, 1);
        this.name = "kgrid";
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(this.jsonSchemaId, this.jsonSchemaPatchConfig);
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "kgrid");
        return new KGridFormDataManager(contextItem, externalContext);
    }
    applyConvergenceParameter(parameter) {
        this.setData({
            ...this.getData(),
            ...parameter.unitContext.data,
        });
        this.setIsEdited(true);
    }
}
exports.default = KGridFormDataManager;
