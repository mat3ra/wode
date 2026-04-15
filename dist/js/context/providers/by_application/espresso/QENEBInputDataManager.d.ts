import type { InputContextItemSchema, QENEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MaterialsSetContextMixin, type MaterialsSetExternalContext } from "../../../mixins/MaterialsSetContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
import { type JobExternalContext, type MethodDataExternalContext, type WorkflowExternalContext } from "./QEPWXInputDataManager";
type Data = QENEBContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & JobExternalContext & MaterialsExternalContext & MethodDataExternalContext & MaterialsSetExternalContext & MaterialExternalContext;
interface QENEBInputDataManager extends MaterialContextMixin, MaterialsContextMixin, MaterialsSetContextMixin {
}
declare class QENEBInputDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): QENEBInputDataManager;
    readonly jsonSchema: JSONSchema7;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Data;
}
export default QENEBInputDataManager;
