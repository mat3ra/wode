import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { BoundaryConditionsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Schema = BoundaryConditionsContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin>;
declare const BoundaryConditionsFormDataManager_base: Base;
export default class BoundaryConditionsFormDataManager extends BoundaryConditionsFormDataManager_base {
    readonly name: "boundaryConditions";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): BoundaryConditionsFormDataManager;
    readonly humanName: "Boundary Conditions";
    readonly uiSchema: {
        readonly type: {
            readonly "ui:disabled": true;
        };
        readonly offset: {
            readonly "ui:disabled": true;
        };
        readonly electricField: {};
        readonly targetFermiEnergy: {};
    };
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Schema["data"];
    get jsonSchema(): JSONSchema;
}
export {};
