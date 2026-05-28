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
class HubbardJContextProvider extends HubbardContextProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "hubbard_j";
        this.uiSchemaStyled = {
            "ui:options": {
                addable: true,
                orderable: true,
                removable: true,
            },
        };
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
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
exports.default = HubbardJContextProvider;
