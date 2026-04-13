"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const defaultData = {
    value: 0.0,
    isTotalMagnetization: false,
    totalMagnetization: 0.0,
};
const jsonSchemaId = "context-providers-directory/collinear-magnetization-context-provider";
class CollinearMagnetizationDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "collinearMagnetization");
        return new CollinearMagnetizationDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        var _a, _b, _c, _d;
        super(contextItem, externalContext);
        this.name = "collinearMagnetization";
        this.domain = "important";
        this.entityName = "unit";
        this.initMaterialContextMixin(externalContext);
        this.uniqueElementsWithLabels = [
            ...new Set(((_b = (_a = this.material) === null || _a === void 0 ? void 0 : _a.Basis) === null || _b === void 0 ? void 0 : _b.elementsWithLabelsArray) || []),
        ];
        this.firstElement =
            ((_c = this.uniqueElementsWithLabels) === null || _c === void 0 ? void 0 : _c.length) > 0 ? this.uniqueElementsWithLabels[0] : "";
        this.isTotalMagnetization = ((_d = this.data) === null || _d === void 0 ? void 0 : _d.isTotalMagnetization) || false;
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            "properties.startingMagnetization": {
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "properties.startingMagnetization.items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "properties.startingMagnetization.items.properties.value": {
                default: defaultData.value,
            },
            "properties.isTotalMagnetization": {
                default: defaultData.isTotalMagnetization,
            },
            "properties.totalMagnetization": {
                default: defaultData.totalMagnetization,
            },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        return {
            startingMagnetization: [
                {
                    index: 1,
                    atomicSpecies: this.firstElement,
                    value: defaultData.value,
                },
            ],
            isTotalMagnetization: defaultData.isTotalMagnetization,
            totalMagnetization: defaultData.totalMagnetization,
        };
    }
    setData(data) {
        const startingMagnetization = data.startingMagnetization.map((row) => ({
            ...row,
            index: this.uniqueElementsWithLabels.indexOf(row.atomicSpecies) + 1,
        }));
        super.setData({
            ...data,
            startingMagnetization,
        });
    }
    get uiSchemaStyled() {
        return {
            startingMagnetization: {
                items: {
                    atomicSpecies: {
                        "ui:classNames": "col-xs-3",
                    },
                    value: {
                        "ui:classNames": "col-xs-6",
                    },
                },
                "ui:readonly": this.isTotalMagnetization,
            },
            isTotalMagnetization: {},
            totalMagnetization: {
                "ui:classNames": "col-xs-6",
                "ui:readonly": !this.isTotalMagnetization,
            },
        };
    }
}
exports.default = CollinearMagnetizationDataManager;
(0, MaterialContextMixin_1.default)(CollinearMagnetizationDataManager.prototype);
