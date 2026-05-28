import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { PointsGridDataProviderSchema, Vector3DSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "../base/ContextProvider";
import type { JinjaExternalContext } from "../base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "../base/JSONSchemaFormDataProvider";
type Name = string;
type Data = PointsGridDataProviderSchema;
type EContext = JinjaExternalContext & MaterialExternalContext & {
    divisor: number;
};
type Base = typeof JSONSchemaFormDataProvider<Name, Data, object, EContext> & Constructor<MaterialContextMixin>;
declare const PointsGridFormDataProvider_base: Base;
export default abstract class PointsGridFormDataProvider<N extends string = string> extends PointsGridFormDataProvider_base {
    abstract readonly name: N;
    readonly domain: Domain;
    dimensions: Vector3DSchema;
    shifts: Vector3DSchema;
    private reciprocalLattice;
    private gridMetricType;
    private gridMetricValue;
    private preferGridMetric;
    private defaultDimensions;
    private reciprocalVectorRatios;
    private defaultMetric;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(contextItem: ContextItem<Data>, externalContext: EContext);
    private initInstanceFields;
    private getDefaultGridMetricValue;
    getDefaultData(): PointsGridDataProviderSchema;
    private get jsonSchemaPatchConfig();
    get uiSchema(): {
        dimensions: {
            "ui:options": {
                addable: boolean;
                orderable: boolean;
                removable: boolean;
            };
            items: {
                "ui:disabled": boolean;
                "ui:placeholder": string;
                "ui:emptyValue": number;
                "ui:label": boolean;
            };
        };
        shifts: {
            "ui:options": {
                addable: boolean;
                orderable: boolean;
                removable: boolean;
            };
            items: {
                "ui:disabled": boolean;
                "ui:placeholder": string;
                "ui:emptyValue": number;
                "ui:label": boolean;
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
    setData(data?: Data): void;
}
export {};
