"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const ApplicationContextMixin_1 = require("../mixins/ApplicationContextMixin");
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/ml-train-test-split-context-provider";
const defaultData = {
    fraction_held_as_test_set: 0.2,
};
class MLTrainTestSplitContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "mlTrainTestSplit";
        this.domain = "important";
        this.uiSchema = {
            target_column_name: {},
            problem_category: {},
        };
        this.initApplicationContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            fraction_held_as_test_set: { default: defaultData.fraction_held_as_test_set },
        });
    }
    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
exports.default = MLTrainTestSplitContextProvider;
(0, ApplicationContextMixin_1.applicationContextMixin)(MLTrainTestSplitContextProvider.prototype);
