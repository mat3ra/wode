"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JSONSchemaFormDataProvider_1 = __importDefault(require("./base/JSONSchemaFormDataProvider"));
const jsonSchemaId = "context-providers-directory/ion-dynamics-context-provider";
const defaultData = {
    numberOfSteps: 100,
    timeStep: 5.0,
    electronMass: 100.0,
    temperature: 300.0,
};
class IonDynamicsDataManager extends JSONSchemaFormDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "dynamics");
        return new IonDynamicsDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "dynamics";
        this.domain = "important";
        this.entityName = "unit";
        this.uiSchema = {
            numberOfSteps: {},
            timeStep: {},
            electronMass: {},
            temperature: {},
        };
        this.extraData = {};
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            numberOfSteps: { default: defaultData.numberOfSteps },
            timeStep: { default: defaultData.timeStep },
            electronMass: { default: defaultData.electronMass },
            temperature: { default: defaultData.temperature },
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
exports.default = IonDynamicsDataManager;
