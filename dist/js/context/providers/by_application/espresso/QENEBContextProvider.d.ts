import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { QENEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type JobContextMixin, type JobExternalContext } from "../../../mixins/JobContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MaterialsSetContextMixin } from "../../../mixins/MaterialsSetContextMixin";
import { type MethodDataContextMixin, type MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import { type WorkflowContextMixin, type WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { ContextItem, Domain } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Name = "input";
type Data = QENEBContextProviderSchema;
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & JobExternalContext & MaterialsExternalContext & MethodDataExternalContext & MaterialsSetContextMixin & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<JobContextMixin> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin> & Constructor<MaterialsSetContextMixin> & Constructor<WorkflowContextMixin> & Constructor<MethodDataContextMixin>;
declare const QENEBContextProvider_base: Base;
export default class QENEBContextProvider extends QENEBContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): Data;
}
export {};
