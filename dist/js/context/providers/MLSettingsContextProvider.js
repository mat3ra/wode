"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const ApplicationContextMixin_1 = require("../mixins/ApplicationContextMixin");
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/ml-settings-context-provider";
const defaultData = {
    target_column_name: "target",
    problem_category: "regression",
};
class MLSettingsContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "mlSettings";
        this.domain = "important";
        this.uiSchema = {
            target_column_name: {},
            problem_category: {},
        };
        this.initApplicationContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            target_column_name: { default: defaultData.target_column_name },
            problem_category: { default: defaultData.problem_category },
        });
    }
    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
exports.default = MLSettingsContextProvider;
(0, ApplicationContextMixin_1.applicationContextMixin)(MLSettingsContextProvider.prototype);
