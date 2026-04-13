"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const HubbardContextProvider_1 = __importDefault(require("./HubbardContextProvider"));
const defaultHubbardConfig = {
    paramType: "J",
    atomicSpecies: "",
    atomicOrbital: "2p",
    value: 1.0,
};
const jsonSchemaId = "context-providers-directory/hubbard-j-context-provider";
class HubbardJContextManager extends HubbardContextProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "hubbard_j");
        return new HubbardJContextManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "hubbard_j";
        this.entityName = "unit";
        this.uiSchemaStyled = {
            "ui:options": {
                addable: true,
                orderable: true,
                removable: true,
            },
        };
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.paramType": {
                default: defaultHubbardConfig.paramType,
            },
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.value": {
                default: defaultHubbardConfig.value,
            },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        return [
            {
                ...defaultHubbardConfig,
                atomicSpecies: this.firstElement,
            },
        ];
    }
}
exports.default = HubbardJContextManager;
