import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { VASPContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type JobContextMixin, type JobExternalContext } from "../../../mixins/JobContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin } from "../../../mixins/MaterialsContextMixin";
import { type MethodDataContextMixin, type MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import { type WorkflowContextMixin, type WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { ContextItem, Domain } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Name = "input";
type Data = VASPContextProviderSchema;
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & JobExternalContext & MaterialExternalContext & MethodDataExternalContext & MaterialsContextMixin;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<JobContextMixin> & Constructor<MaterialContextMixin> & Constructor<MethodDataContextMixin> & Constructor<MaterialsContextMixin> & Constructor<WorkflowContextMixin>;
declare const VASPContextProvider_base: Base;
export default class VASPContextProvider extends VASPContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: ContextItem<Data>, externalContext: ExternalContext);
    private buildVASPContext;
    private getDataPerMaterial;
    getDefaultData(): {
        perMaterial?: undefined;
        POSCAR: string;
        POSCAR_WITH_CONSTRAINTS: string;
        contextProviderName: "vasp";
    } | {
        perMaterial: VASPContextProviderSchema[];
        POSCAR: string;
        POSCAR_WITH_CONSTRAINTS: string;
        contextProviderName: "vasp";
    };
}
export {};
