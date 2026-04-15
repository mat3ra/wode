import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { BoundaryConditionsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Schema = BoundaryConditionsContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
interface BoundaryConditionsFormDataManager extends MaterialContextMixin {
}
declare class BoundaryConditionsFormDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
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
export default BoundaryConditionsFormDataManager;
