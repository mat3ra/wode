import type { PointsGridDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { MaterialExternalContext } from "../../mixins/MaterialContextMixin";
type UnitContext = Array<{
    name?: string;
    data?: PointsGridDataProviderSchema;
}> | unknown;
export declare function getKgridDataFromUnitContext(context: UnitContext): PointsGridDataProviderSchema | undefined;
export declare function getEffectiveKgridPrecision(kgridData: PointsGridDataProviderSchema, externalContext: MaterialExternalContext): {
    value: number;
    metric: NonNullable<PointsGridDataProviderSchema["gridMetricType"]>;
};
export {};
