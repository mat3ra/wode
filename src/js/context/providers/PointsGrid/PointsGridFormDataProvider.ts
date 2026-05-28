import { Units } from "@mat3ra/code/dist/js/constants";
import { math as codeJSMath } from "@mat3ra/code/dist/js/math";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { PointsGridDataProviderSchema, Vector3DSchema } from "@mat3ra/esse/dist/js/types";
import { type ReciprocalLattice, Made } from "@mat3ra/made";
import type { JSONSchema7 } from "json-schema";
import lodash from "lodash";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "../base/ContextProvider";
import type { JinjaExternalContext } from "../base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "../base/JSONSchemaFormDataProvider";
import { globalSettings } from "../settings";

type Name = string;
type Data = PointsGridDataProviderSchema;
type EContext = JinjaExternalContext &
    MaterialExternalContext & {
        divisor: number;
    };
type Base = typeof JSONSchemaFormDataProvider<Name, Data, object, EContext> &
    Constructor<MaterialContextMixin>;

type GridMetricType = Required<Data>["gridMetricType"];

// Helper function to create vector schema with defaults
const vector = (
    defaultValue: string | number | readonly number[] | readonly string[],
    isStringType = false,
) => {
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
const defaultShifts: Vector3DSchema = [defaultShift, defaultShift, defaultShift];

export default abstract class PointsGridFormDataProvider<
    N extends string = string,
> extends (JSONSchemaFormDataProvider as Base) {
    abstract readonly name: N;

    readonly domain: Domain = "important";

    public dimensions!: Vector3DSchema;

    public shifts!: Vector3DSchema;

    private reciprocalLattice!: ReciprocalLattice;

    private gridMetricType!: GridMetricType;

    private gridMetricValue!: number;

    private preferGridMetric!: boolean;

    private defaultDimensions!: Vector3DSchema;

    private reciprocalVectorRatios!: Vector3DSchema;

    private defaultMetric!: {
        type: GridMetricType;
        value: number;
    };

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(contextItem: ContextItem<Data>, externalContext: EContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initInstanceFields();

        const { jsonSchemaPatchConfig } = this;

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(
            jsonSchemaId,
            jsonSchemaPatchConfig,
        );
    }

    private initInstanceFields() {
        this.defaultMetric = {
            type: "KPPRA" as const,
            value: this.getDefaultGridMetricValue("KPPRA"),
        };

        this.shifts = this.data?.shifts || [...defaultShifts];
        this.gridMetricType = this.data?.gridMetricType || this.defaultMetric.type;
        this.gridMetricValue = this.data?.gridMetricValue || this.defaultMetric.value;
        this.preferGridMetric = this.data?.preferGridMetric || false;

        this.reciprocalLattice = new Made.ReciprocalLattice(this.material?.lattice);
        this.defaultDimensions = this.calculateDimensions({
            gridMetricType: this.defaultMetric.type,
            gridMetricValue: this.defaultMetric.value,
        });
        this.dimensions = this.data?.dimensions || this.defaultDimensions;
        this.reciprocalVectorRatios = this.reciprocalLattice.reciprocalVectorRatios.map((r) =>
            Number(codeJSMath.numberToPrecision(r, 3)),
        ) as Vector3DSchema;
    }

    private getDefaultGridMetricValue(metric: GridMetricType) {
        switch (metric) {
            case "KPPRA": {
                const divisor = this.externalContext?.divisor || 1;
                const { defaultKPPRA } = globalSettings;
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
        const defaultData: Data = {
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

    private get jsonSchemaPatchConfig() {
        const metricDescription = {
            KPPRA: `${this.name.toUpperCase()}PPRA (${this.name}pt per reciprocal atom)`, // KPPRA or QPPRA
            spacing: "grid spacing",
        };

        const gridMetricType = this.data?.gridMetricType || this.defaultMetric.type;

        return {
            dimensions: vector(this.defaultDimensions, this.isUsingJinjaVariables),
            shifts: vector(defaultShifts),
            reciprocalVectorRatios: vector(this.reciprocalVectorRatios),
            gridMetricType: { default: this.defaultMetric.type },
            description: `3D grid with shifts. Default min value for ${
                metricDescription[gridMetricType]
            } is ${this.getDefaultGridMetricValue(gridMetricType)}.`,
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

    private calculateDimensions({
        gridMetricType,
        gridMetricValue,
    }: // units = Units.angstrom,
    Pick<Data, "gridMetricType" | "gridMetricValue">): Vector3DSchema {
        switch (gridMetricType) {
            case "KPPRA": {
                const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
                return this.reciprocalLattice.getDimensionsFromPointsCount(
                    gridMetricValue / nAtoms,
                );
            }
            case "spacing":
                return this.reciprocalLattice.getDimensionsFromSpacing(
                    gridMetricValue,
                    Units.angstrom,
                );
            default:
                return [1, 1, 1];
        }
    }

    private calculateGridMetric({
        gridMetricType,
        dimensions,
    }: // units = Units.angstrom,
    Pick<Data, "gridMetricType" | "dimensions">) {
        switch (gridMetricType) {
            case "KPPRA": {
                const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
                return dimensions.reduce((a, b) => a * b) * nAtoms;
            }
            case "spacing":
                return lodash.round(
                    this.reciprocalLattice.getSpacingFromDimensions(dimensions, Units.angstrom),
                    3,
                );
            default:
                return 1;
        }
    }

    setData(data?: Data) {
        const canTransform =
            (data?.preferGridMetric && data?.gridMetricType && data?.gridMetricValue) ||
            (!data?.preferGridMetric && data?.dimensions?.every((d) => typeof d === "number"));

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

materialContextMixin(PointsGridFormDataProvider.prototype);
