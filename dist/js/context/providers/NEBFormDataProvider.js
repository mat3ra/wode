"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JSONSchemaFormDataProvider_1 = __importDefault(require("./base/JSONSchemaFormDataProvider"));
const jsonSchemaId = "context-providers-directory/neb-data-provider";
const defaultData = {
    nImages: 1,
};
class NEBFormDataProvider extends JSONSchemaFormDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "neb";
        this.domain = "important";
        this.uiSchema = {
            nImages: {},
        };
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            nImages: { default: defaultData.nImages },
        });
    }
    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
exports.default = NEBFormDataProvider;
