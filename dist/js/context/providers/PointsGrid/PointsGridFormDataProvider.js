"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@mat3ra/code/dist/js/constants");
const math_1 = require("@mat3ra/code/dist/js/math");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const made_1 = require("@mat3ra/made");
const lodash_1 = __importDefault(require("lodash"));
const MaterialContextMixin_1 = __importDefault(require("../../mixins/MaterialContextMixin"));
const JSONSchemaFormDataProvider_1 = __importDefault(require("../base/JSONSchemaFormDataProvider"));
const settings_1 = require("../settings");
// Helper function to create vector schema with defaults
const vector = (defaultValue, isStringType = false) => {
    const isArray = Array.isArray(defaultValue);
    return {
        type: "array",
        items: {
            type: isStringType ? "string" : "number",
            ...(isArray ? {} : { default: defaultValue }),
        },
        minItems: 3,
        maxItems: 3,
        ...(isArray ? { default: defaultValue } : {}),
    };
};
const jsonSchemaId = "context-providers-directory/points-grid-data-provider";
const defaultShift = 0;
const defaultShifts = [defaultShift, defaultShift, defaultShift];
class PointsGridFormDataProvider extends JSONSchemaFormDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.domain = "important";
        this.initMaterialContextMixin(externalContext);
        this.initInstanceFields();
        const { jsonSchemaPatchConfig } = this;
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, jsonSchemaPatchConfig);
    }
    initInstanceFields() {
        var _a, _b, _c, _d, _e, _f;
        this.defaultMetric = {
            type: "KPPRA",
            value: this.getDefaultGridMetricValue("KPPRA"),
        };
        this.shifts = ((_a = this.data) === null || _a === void 0 ? void 0 : _a.shifts) || [...defaultShifts];
        this.gridMetricType = ((_b = this.data) === null || _b === void 0 ? void 0 : _b.gridMetricType) || this.defaultMetric.type;
        this.gridMetricValue = ((_c = this.data) === null || _c === void 0 ? void 0 : _c.gridMetricValue) || this.defaultMetric.value;
        this.preferGridMetric = ((_d = this.data) === null || _d === void 0 ? void 0 : _d.preferGridMetric) || false;
        this.reciprocalLattice = new made_1.Made.ReciprocalLattice((_e = this.material) === null || _e === void 0 ? void 0 : _e.lattice);
        this.defaultDimensions = this.calculateDimensions({
            gridMetricType: this.defaultMetric.type,
            gridMetricValue: this.defaultMetric.value,
        });
        this.dimensions = ((_f = this.data) === null || _f === void 0 ? void 0 : _f.dimensions) || this.defaultDimensions;
        this.reciprocalVectorRatios = this.reciprocalLattice.reciprocalVectorRatios.map((r) => Number(math_1.math.numberToPrecision(r, 3)));
    }
    getDefaultGridMetricValue(metric) {
        var _a;
        switch (metric) {
            case "KPPRA": {
                const divisor = ((_a = this.externalContext) === null || _a === void 0 ? void 0 : _a.divisor) || 1;
                const { defaultKPPRA } = settings_1.globalSettings;
                return Math.floor(defaultKPPRA / divisor);
            }
            case "spacing":
                return 0.3;
            default:
                console.error("Metric type not recognized!");
                return 1;
        }
    }
    getDefaultData() {
        const defaultData = {
            dimensions: this.defaultDimensions,
            shifts: defaultShifts,
            gridMetricType: this.defaultMetric.type,
            gridMetricValue: this.defaultMetric.value,
            preferGridMetric: false,
            reciprocalVectorRatios: this.reciprocalVectorRatios,
        };
        if (this.material) {
            const { gridMetricType, gridMetricValue } = this;
            // if `data` is present and material is updated, prioritize `data` when `preferGridMetric` is not set
            return this.preferGridMetric
                ? {
                    dimensions: this.calculateDimensions({ gridMetricType, gridMetricValue }),
                    shifts: defaultShifts,
                    gridMetricType,
                    gridMetricValue,
                }
                : this.data || defaultData;
        }
        return defaultData;
    }
    get jsonSchemaPatchConfig() {
        var _a;
        const metricDescription = {
            KPPRA: `${this.name.toUpperCase()}PPRA (${this.name}pt per reciprocal atom)`, // KPPRA or QPPRA
            spacing: "grid spacing",
        };
        const gridMetricType = ((_a = this.data) === null || _a === void 0 ? void 0 : _a.gridMetricType) || this.defaultMetric.type;
        return {
            dimensions: vector(this.defaultDimensions, this.isUsingJinjaVariables),
            shifts: vector(defaultShifts),
            reciprocalVectorRatios: vector(this.reciprocalVectorRatios),
            gridMetricType: { default: this.defaultMetric.type },
            description: `3D grid with shifts. Default min value for ${metricDescription[gridMetricType]} is ${this.getDefaultGridMetricValue(gridMetricType)}.`,
            required: ["dimensions", "shifts"],
            dependencies: {
                gridMetricType: {
                    oneOf: [
                        {
                            properties: {
                                gridMetricType: { enum: ["KPPRA"] },
                                gridMetricValue: {
                                    type: "integer",
                                    minimum: 1,
                                    title: "Value",
                                    default: this.gridMetricValue,
                                },
                                preferGridMetric: {
                                    type: "boolean",
                                    title: "prefer KPPRA",
                                    default: this.preferGridMetric,
                                },
                            },
                        },
                        {
                            properties: {
                                gridMetricType: { enum: ["spacing"] },
                                gridMetricValue: {
                                    type: "number",
                                    minimum: 0,
                                    title: "Value [1/Å]",
                                    default: this.gridMetricValue,
                                },
                                preferGridMetric: {
                                    type: "boolean",
                                    title: "prefer spacing",
                                    default: this.preferGridMetric,
                                },
                            },
                        },
                    ],
                },
            },
        };
    }
    get uiSchema() {
        const arraySubStyle = (emptyValue = 0) => {
            return {
                "ui:options": {
                    addable: false,
                    orderable: false,
                    removable: false,
                },
                items: {
                    "ui:disabled": this.preferGridMetric,
                    // TODO: extract the actual current values from context
                    "ui:placeholder": "1",
                    "ui:emptyValue": emptyValue,
                    "ui:label": false,
                },
            };
        };
        return {
            dimensions: arraySubStyle(1),
            shifts: arraySubStyle(0),
            gridMetricType: {
                "ui:title": "Grid Metric",
            },
            gridMetricValue: {
                "ui:disabled": !this.preferGridMetric,
                "ui:emptyValue": this.gridMetricValue,
                "ui:placeholder": this.gridMetricValue.toString(), // make string to prevent prop type error
            },
            preferGridMetric: {
                "ui:emptyValue": true,
                "ui:disabled": this.isUsingJinjaVariables,
            },
            reciprocalVectorRatios: {
                "ui:title": "reciprocal vector ratios",
                "ui:orderable": false,
                "ui:removable": false,
                "ui:readonly": true,
                items: {
                    "ui:label": false,
                },
            },
        };
    }
    calculateDimensions({ gridMetricType, gridMetricValue, }) {
        switch (gridMetricType) {
            case "KPPRA": {
                const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
                return this.reciprocalLattice.getDimensionsFromPointsCount(gridMetricValue / nAtoms);
            }
            case "spacing":
                return this.reciprocalLattice.getDimensionsFromSpacing(gridMetricValue, constants_1.Units.angstrom);
            default:
                return [1, 1, 1];
        }
    }
    calculateGridMetric({ gridMetricType, dimensions, }) {
        switch (gridMetricType) {
            case "KPPRA": {
                const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
                return dimensions.reduce((a, b) => a * b) * nAtoms;
            }
            case "spacing":
                return lodash_1.default.round(this.reciprocalLattice.getSpacingFromDimensions(dimensions, constants_1.Units.angstrom), 3);
            default:
                return 1;
        }
    }
    setData(data) {
        var _a;
        const canTransform = ((data === null || data === void 0 ? void 0 : data.preferGridMetric) && (data === null || data === void 0 ? void 0 : data.gridMetricType) && (data === null || data === void 0 ? void 0 : data.gridMetricValue)) ||
            (!(data === null || data === void 0 ? void 0 : data.preferGridMetric) && ((_a = data === null || data === void 0 ? void 0 : data.dimensions) === null || _a === void 0 ? void 0 : _a.every((d) => typeof d === "number")));
        if (!data || !canTransform) {
            return super.setData(data);
        }
        // dimensions are calculated from grid metric or vice versa
        if (data.preferGridMetric) {
            return super.setData({
                ...data,
                dimensions: this.calculateDimensions(data),
            });
        }
        super.setData({
            ...data,
            gridMetricValue: this.calculateGridMetric(data),
        });
    }
}
exports.default = PointsGridFormDataProvider;
(0, MaterialContextMixin_1.default)(PointsGridFormDataProvider.prototype);
