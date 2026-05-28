import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { NWChemTotalEnergyContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type JobContextMixin, type JobExternalContext } from "../../../mixins/JobContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MethodDataContextMixin, type MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import { type WorkflowContextMixin, type WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { ContextItem, Domain } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Name = "input";
type Data = NWChemTotalEnergyContextProviderSchema;
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & JobExternalContext & MethodDataExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<JobContextMixin> & Constructor<MaterialContextMixin> & Constructor<MethodDataContextMixin> & Constructor<WorkflowContextMixin>;
declare const NWChemTotalEnergyContextProvider_base: Base;
export default class NWChemTotalEnergyContextProvider extends NWChemTotalEnergyContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: ContextItem<Data>, externalContext: ExternalContext);
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
    };
}
export {};
