"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const defaultData = {
    isExistingChargeDensity: false,
    isStartingMagnetization: true,
    isConstrainedMagnetization: false,
    isArbitrarySpinAngle: false,
    isArbitrarySpinDirection: false,
    isFixedMagnetization: false,
    lforcet: true,
    value: 0.0,
    angle1: 0.0,
    angle2: 0.0,
    constrainType: "atomic direction",
    lambda: 0.0,
    fixedMagnetizationX: 0.0,
    fixedMagnetizationY: 0.0,
    fixedMagnetizationZ: 0.0,
};
const jsonSchemaId = "context-providers-directory/non-collinear-magnetization-context-provider";
class NonCollinearMagnetizationDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "nonCollinearMagnetization");
        return new NonCollinearMagnetizationDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(contextItem, externalContext);
        this.name = "nonCollinearMagnetization";
        this.domain = "important";
        this.entityName = "unit";
        this.initMaterialContextMixin(externalContext);
        this.isStartingMagnetization = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.isStartingMagnetization) !== null && _b !== void 0 ? _b : true;
        this.isConstrainedMagnetization = (_d = (_c = this.data) === null || _c === void 0 ? void 0 : _c.isConstrainedMagnetization) !== null && _d !== void 0 ? _d : false;
        this.isExistingChargeDensity = (_f = (_e = this.data) === null || _e === void 0 ? void 0 : _e.isExistingChargeDensity) !== null && _f !== void 0 ? _f : false;
        this.isArbitrarySpinDirection = (_h = (_g = this.data) === null || _g === void 0 ? void 0 : _g.isArbitrarySpinDirection) !== null && _h !== void 0 ? _h : false;
        this.isFixedMagnetization = (_k = (_j = this.data) === null || _j === void 0 ? void 0 : _j.isFixedMagnetization) !== null && _k !== void 0 ? _k : false;
        this.constrainedMagnetization = (_m = (_l = this.data) === null || _l === void 0 ? void 0 : _l.constrainedMagnetization) !== null && _m !== void 0 ? _m : {
            lambda: 0.0,
            constrainType: "atomic direction",
        };
        this.uniqueElementsWithLabels = [
            ...new Set(((_p = (_o = this.material) === null || _o === void 0 ? void 0 : _o.Basis) === null || _p === void 0 ? void 0 : _p.elementsWithLabelsArray) || []),
        ];
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            isExistingChargeDensity: { default: defaultData.isExistingChargeDensity },
            isStartingMagnetization: { default: defaultData.isStartingMagnetization },
            isArbitrarySpinAngle: { default: defaultData.isArbitrarySpinAngle },
            isConstrainedMagnetization: { default: defaultData.isConstrainedMagnetization },
            isFixedMagnetization: { default: defaultData.isFixedMagnetization },
            startingMagnetization: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "startingMagnetization.items.properties.value": {
                default: defaultData.value,
                minimum: -1.0,
                maximum: 1.0,
            },
            spinAngles: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "spinAngles.items.properties.angle1": { default: defaultData.angle1 },
            "spinAngles.items.properties.angle2": { default: defaultData.angle2 },
            "constrainedMagnetization.properties.constrainType": {
                default: defaultData.constrainType,
            },
            "constrainedMagnetization.properties.lambda": { default: defaultData.lambda },
            "fixedMagnetization.properties.x": { default: defaultData.fixedMagnetizationX },
            "fixedMagnetization.properties.y": { default: defaultData.fixedMagnetizationY },
            "fixedMagnetization.properties.z": { default: defaultData.fixedMagnetizationZ },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        const startingMagnetization = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                value: defaultData.value,
            };
        });
        const spinAngles = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                angle1: defaultData.angle1,
                angle2: defaultData.angle2,
            };
        });
        return {
            isExistingChargeDensity: defaultData.isExistingChargeDensity,
            isStartingMagnetization: defaultData.isStartingMagnetization,
            isConstrainedMagnetization: defaultData.isConstrainedMagnetization,
            isArbitrarySpinAngle: defaultData.isArbitrarySpinAngle,
            isArbitrarySpinDirection: defaultData.isArbitrarySpinDirection,
            isFixedMagnetization: defaultData.isFixedMagnetization,
            lforcet: defaultData.lforcet,
            spinAngles,
            startingMagnetization,
            constrainedMagnetization: {
                lambda: defaultData.lambda,
                constrainType: defaultData.constrainType,
            },
            fixedMagnetization: {
                x: defaultData.fixedMagnetizationX,
                y: defaultData.fixedMagnetizationY,
                z: defaultData.fixedMagnetizationZ,
            },
        };
    }
    get uiSchemaStyled() {
        var _a, _b;
        return {
            isExistingChargeDensity: {},
            lforcet: {
                "ui:readonly": !this.isExistingChargeDensity,
                "ui:widget": "radio",
                "ui:options": {
                    inline: true,
                },
            },
            isArbitrarySpinDirection: {},
            spinAngles: {
                items: {
                    atomicSpecies: {
                        "ui:readonly": true,
                    },
                },
                "ui:readonly": !this.isArbitrarySpinDirection,
                "ui:options": {
                    addable: false,
                    orderable: false,
                    removable: false,
                },
            },
            isStartingMagnetization: {},
            startingMagnetization: {
                items: {
                    atomicSpecies: {
                        "ui:readonly": true,
                    },
                    value: {
                        "ui:classNames": "col-xs-6",
                    },
                },
                "ui:readonly": !this.isStartingMagnetization,
                "ui:options": {
                    addable: false,
                    orderable: false,
                    removable: false,
                },
            },
            isConstrainedMagnetization: {},
            constrainedMagnetization: {
                "ui:readonly": !this.isConstrainedMagnetization,
            },
            isFixedMagnetization: {
                "ui:readonly": !(this.isConstrainedMagnetization &&
                    ((_a = this.constrainedMagnetization) === null || _a === void 0 ? void 0 : _a.constrainType) === "total"),
            },
            fixedMagnetization: {
                "ui:readonly": !(this.isFixedMagnetization &&
                    this.isConstrainedMagnetization &&
                    ((_b = this.constrainedMagnetization) === null || _b === void 0 ? void 0 : _b.constrainType) === "total"),
            },
        };
    }
}
exports.default = NonCollinearMagnetizationDataManager;
(0, MaterialContextMixin_1.default)(NonCollinearMagnetizationDataManager.prototype);
