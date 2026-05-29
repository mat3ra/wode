"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const HubbardContextProvider_1 = __importDefault(require("./HubbardContextProvider"));
const defaultHubbardConfig = {
    hubbardUValue: 1.0,
};
const jsonSchemaId = "context-providers-directory/hubbard-legacy-context-provider";
class HubbardContextManagerLegacy extends HubbardContextProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "hubbard_legacy");
        return new HubbardContextManagerLegacy(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "hubbard_legacy";
        this.domain = "important";
        this.entityName = "unit";
        this.uiSchemaStyled = {
            "ui:options": {
                addable: true,
                orderable: false,
                removable: true,
            },
            items: {
                atomicSpeciesIndex: { "ui:readonly": true },
            },
        };
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
            },
            "items.properties.hubbardUValue": {
                default: defaultHubbardConfig.hubbardUValue,
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
                atomicSpeciesIndex: ((_a = this.uniqueElementsWithLabels) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 1 : undefined,
            },
        ];
    }
    setData(data) {
        const hubbardUValues = data.map((row) => {
            var _a;
            const atomicSpeciesIndex = ((_a = this.uniqueElementsWithLabels) === null || _a === void 0 ? void 0 : _a.length) > 0
                ? this.uniqueElementsWithLabels.indexOf(row.atomicSpecies || "") + 1
                : undefined;
            return {
                ...row,
                atomicSpeciesIndex,
            };
        });
        super.setData(hubbardUValues);
    }
}
exports.default = HubbardContextManagerLegacy;
