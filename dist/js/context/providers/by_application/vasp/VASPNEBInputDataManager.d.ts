import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { InputContextItemSchema, VASPNEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MaterialsSetContextMixin, type MaterialsSetExternalContext } from "../../../mixins/MaterialsSetContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Data = VASPNEBContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & MaterialExternalContext & MaterialsExternalContext & MaterialsSetExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin> & Constructor<MaterialsSetContextMixin>;
declare const VASPNEBInputDataManager_base: Base;
export default class VASPNEBInputDataManager extends VASPNEBInputDataManager_base {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): VASPNEBInputDataManager;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): {
        FIRST_IMAGE: string;
        LAST_IMAGE: string;
        INTERMEDIATE_IMAGES: string[];
        contextProviderName: "vasp-neb";
    };
}
export {};
