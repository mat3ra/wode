import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { InputContextItemSchema, NWChemTotalEnergyContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Data = NWChemTotalEnergyContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin>;
declare const NWChemInputDataManager_base: Base;
export default class NWChemInputDataManager extends NWChemInputDataManager_base {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): NWChemInputDataManager;
    readonly contextProviderName: "nwchem-total-energy";
    readonly jsonSchema: JSONSchema7;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): {
        CHARGE: number;
        MULT: number;
        BASIS: string;
        NAT: number;
        NTYP: number;
        ATOMIC_POSITIONS: string;
        ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: string;
        ATOMIC_SPECIES: string;
        FUNCTIONAL: string;
        CARTESIAN: boolean;
        contextProviderName: "nwchem-total-energy";
    };
}
export {};
