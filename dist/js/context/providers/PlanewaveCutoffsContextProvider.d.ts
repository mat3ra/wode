import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { PlanewaveCutoffsContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type ApplicationContextMixin } from "../mixins/ApplicationContextMixin";
import ContextProvider, { type ContextItem, type Domain, type EntityName, type ExternalContext } from "./base/ContextProvider";
type Name = "cutoffs";
type Data = PlanewaveCutoffsContextProviderSchema;
type PlanewaveExternalContext = ExternalContext & ApplicationContextMixin;
type Base = typeof ContextProvider<Name, Data> & Constructor<ApplicationContextMixin>;
declare const PlanewaveCutoffsContextProvider_base: Base;
export default class PlanewaveCutoffsContextProvider extends PlanewaveCutoffsContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly entityName: EntityName;
    readonly jsonSchema: JSONSchema7 | undefined;
    readonly uiSchema: {
        wavefunction: {};
        density: {};
    };
    constructor(contextItem: ContextItem<Data>, externalContext: PlanewaveExternalContext);
    getDefaultData(): {
        wavefunction: number | undefined;
        density: number | undefined;
    };
}
export {};
