import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { GridContextItemSchema, PointsGridDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import type { JinjaExternalContext } from "../base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "../base/JSONSchemaFormDataProvider";
type Schema = GridContextItemSchema;
type Data = PointsGridDataProviderSchema;
export type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaFormDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin>;
declare const PointsGridFormDataProvider_base: Base;
export default abstract class PointsGridFormDataProvider<N extends Schema["name"]> extends PointsGridFormDataProvider_base {
    abstract readonly name: N;
    readonly domain: "important";
    readonly entityName: "unit";
    readonly jsonSchemaId = "context-providers-directory/points-grid-data-provider";
    dimensions: Data["dimensions"];
    shifts: Data["shifts"];
    private reciprocalLattice;
    private gridMetricType;
    private gridMetricValue;
    private preferGridMetric;
    private defaultDimensions;
    private reciprocalVectorRatios;
    abstract readonly divisor: number;
    private defaultMetric;
    abstract readonly jsonSchema: JSONSchema7 | undefined;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    private initInstanceFields;
    private getDefaultGridMetricValue;
    getDefaultData(): PointsGridDataProviderSchema;
    protected get jsonSchemaPatchConfig(): {
        dimensions: {
            default?: any[] | undefined;
            type: string;
            items: {
                default?: string | number | readonly number[] | readonly string[] | undefined;
                type: string;
            };
            minItems: number;
            maxItems: number;
        };
        shifts: {
            default?: any[] | undefined;
            type: string;
            items: {
                default?: string | number | readonly number[] | readonly string[] | undefined;
                type: string;
            };
            minItems: number;
            maxItems: number;
        };
        reciprocalVectorRatios: {
            default?: any[] | undefined;
            type: string;
            items: {
                default?: string | number | readonly number[] | readonly string[] | undefined;
                type: string;
            };
            minItems: number;
            maxItems: number;
        };
        gridMetricType: {
            default: "KPPRA" | "spacing";
        };
        description: string;
        required: string[];
        dependencies: {
            gridMetricType: {
                oneOf: {
                    properties: {
                        gridMetricType: {
                            enum: string[];
                        };
                        gridMetricValue: {
                            type: string;
                            minimum: number;
                            title: string;
                            default: number;
                        };
                        preferGridMetric: {
                            type: string;
                            title: string;
                            default: boolean;
                        };
                    };
                }[];
            };
        };
    };
    get uiSchema(): {
        dimensions: {
            readonly "ui:options": {
                readonly addable: false;
                readonly orderable: false;
                readonly removable: false;
            };
            readonly items: {
                readonly "ui:disabled": boolean;
                readonly "ui:placeholder": "1";
                readonly "ui:emptyValue": number;
                readonly "ui:label": false;
            };
        };
        shifts: {
            readonly "ui:options": {
                readonly addable: false;
                readonly orderable: false;
                readonly removable: false;
            };
            readonly items: {
                readonly "ui:disabled": boolean;
                readonly "ui:placeholder": "1";
                readonly "ui:emptyValue": number;
                readonly "ui:label": false;
            };
        };
        gridMetricType: {
            "ui:title": string;
        };
        gridMetricValue: {
            "ui:disabled": boolean;
            "ui:emptyValue": number;
            "ui:placeholder": string;
        };
        preferGridMetric: {
            "ui:emptyValue": boolean;
            "ui:disabled": boolean;
        };
        reciprocalVectorRatios: {
            "ui:title": string;
            "ui:orderable": boolean;
            "ui:removable": boolean;
            "ui:readonly": boolean;
            items: {
                "ui:label": boolean;
            };
        };
    };
    private calculateDimensions;
    private calculateGridMetric;
    setData(data: Data): void;
}
export {};
