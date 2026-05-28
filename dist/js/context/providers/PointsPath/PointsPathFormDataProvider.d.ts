import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { PointsPathDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import { type ApplicationContextMixin } from "../../mixins/ApplicationContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";
type Data = PointsPathDataProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<string, Data> & Constructor<MaterialContextMixin> & Constructor<ApplicationContextMixin>;
declare const MixinsContextProvider_base: Base;
declare abstract class MixinsContextProvider extends MixinsContextProvider_base {
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
}
declare abstract class PointsPathFormDataProvider<N extends string> extends MixinsContextProvider {
    abstract name: N;
    readonly domain: Domain;
    private reciprocalLattice;
    readonly useExplicitPath: boolean;
    readonly is2PIBA: boolean;
    constructor(config: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): Data;
    updateMaterialHash(): void;
    get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    setData(path: Data): void;
    private convertToExplicitPath;
}
export default PointsPathFormDataProvider;
