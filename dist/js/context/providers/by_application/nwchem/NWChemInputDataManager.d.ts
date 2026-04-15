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
interface NWChemInputDataManager extends MaterialContextMixin {
}
declare class NWChemInputDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
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
export default NWChemInputDataManager;
