import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { InputContextItemSchema, QENEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MaterialsSetContextMixin, type MaterialsSetExternalContext } from "../../../mixins/MaterialsSetContextMixin";
import type { MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import type { WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Data = QENEBContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & MaterialsExternalContext & MethodDataExternalContext & MaterialsSetExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin> & Constructor<MaterialsSetContextMixin>;
declare const QENEBInputDataManager_base: Base;
export default class QENEBInputDataManager extends QENEBInputDataManager_base {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): QENEBInputDataManager;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Data;
}
export {};
