"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/ml-settings-context-provider";
const defaultData = {
    target_column_name: "target",
    problem_category: "regression",
};
class MLSettingsDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "mlSettings");
        return new MLSettingsDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "mlSettings";
        this.domain = "important";
        this.entityName = "unit";
        this.uiSchema = {
            target_column_name: {},
            problem_category: {},
        };
        this.extraData = {};
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            target_column_name: { default: defaultData.target_column_name },
            problem_category: { default: defaultData.problem_category },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
exports.default = MLSettingsDataManager;
