import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { PathContextItemSchema, PointsPathDataProviderRenderingSchema, PointsPathDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import { type ApplicationContextMixin, type ApplicationExternalContext } from "../../mixins/ApplicationContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";
export type PointsPathFormDataProviderData = PointsPathDataProviderSchema;
export type PointsPathFormDataProviderRenderingData = PointsPathDataProviderRenderingSchema;
export type PointsPathFormDataProviderExternalContext = JinjaExternalContext & MaterialExternalContext & ApplicationExternalContext;
type Data = PointsPathFormDataProviderData;
type RenderingData = PointsPathFormDataProviderRenderingData;
type Schema = PathContextItemSchema;
type ExternalContext = PointsPathFormDataProviderExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext, RenderingData> & Constructor<MaterialContextMixin> & Constructor<ApplicationContextMixin>;
declare const MixinsContextProvider_base: Base;
declare abstract class MixinsContextProvider extends MixinsContextProvider_base {
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
}
declare abstract class PointsPathFormDataProvider<N extends Schema["name"]> extends MixinsContextProvider {
    abstract name: N;
    readonly domain: "important";
    readonly entityName: "unit";
    private reciprocalLattice;
    readonly useExplicitPath: boolean;
    readonly is2PIBA: boolean;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Data;
    updateMaterialHash(): void;
    get jsonSchema(): JSONSchema;
    readonly uiSchemaStyled: {
        items: {
            point: {};
            steps: {};
        };
    };
    protected patchForRendering(data: Data): RenderingData;
    private addCoordinates;
    private convertToExplicitPath;
}
export default PointsPathFormDataProvider;
