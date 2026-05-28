import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { BoundaryConditionsDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Name = "boundaryConditions";
type Data = BoundaryConditionsDataProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<MaterialContextMixin>;
declare const BoundaryConditionsFormDataProvider_base: Base;
export default class BoundaryConditionsFormDataProvider extends BoundaryConditionsFormDataProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly humanName = "Boundary Conditions";
    readonly uiSchema: {
        type: {
            "ui:disabled": boolean;
        };
        offset: {
            "ui:disabled": boolean;
        };
        electricField: {};
        targetFermiEnergy: {};
    };
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): Data;
    get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
}
export {};
