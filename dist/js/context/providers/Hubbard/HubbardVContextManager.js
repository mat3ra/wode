"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const HubbardContextProvider_1 = __importDefault(require("./HubbardContextProvider"));
const defaultHubbardConfig = {
    atomicSpecies: "",
    atomicOrbital: "2p",
    atomicSpecies2: "",
    atomicOrbital2: "2p",
    siteIndex: 1,
    siteIndex2: 1,
    hubbardVValue: 1.0,
};
const jsonSchemaId = "context-providers-directory/hubbard-v-context-provider";
class HubbardVContextManager extends HubbardContextProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "hubbard_v");
        return new HubbardVContextManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        var _a;
        super(contextItem, externalContext);
        this.name = "hubbard_v";
        this.entityName = "unit";
        this.uiSchemaStyled = {
            "ui:options": {
                addable: true,
                orderable: true,
                removable: true,
            },
        };
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "items.properties.siteIndex": {
                default: defaultHubbardConfig.siteIndex,
            },
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.atomicSpecies2": {
                enum: this.uniqueElementsWithLabels,
                default: this.secondSpecies,
            },
            "items.properties.siteIndex2": {
                default: ((_a = this.uniqueElementsWithLabels) === null || _a === void 0 ? void 0 : _a.length) > 1 ? 2 : defaultHubbardConfig.siteIndex2,
            },
            "items.properties.atomicOrbital2": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.hubbardVValue": {
                default: defaultHubbardConfig.hubbardVValue,
            },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        var _a;
        return [
            {
                ...defaultHubbardConfig,
                atomicSpecies: this.firstElement,
                atomicSpecies2: this.secondSpecies,
                siteIndex2: ((_a = this.uniqueElementsWithLabels) === null || _a === void 0 ? void 0 : _a.length) > 1 ? 2 : defaultHubbardConfig.siteIndex2,
            },
        ];
    }
}
exports.default = HubbardVContextManager;
