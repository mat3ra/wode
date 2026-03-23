import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { InputContextItemSchema, VASPContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Data = VASPContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & MaterialExternalContext & MaterialsExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin>;
declare const VASPInputDataManager_base: Base;
export default class VASPInputDataManager extends VASPInputDataManager_base {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): VASPInputDataManager;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
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
