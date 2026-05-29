import type { DynamicsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { BaseExternalContext, UnitContext } from "./base/ContextProvider";
import JSONSchemaFormDataProvider from "./base/JSONSchemaFormDataProvider";
type Schema = DynamicsContextItemSchema;
export default class IonDynamicsDataManager extends JSONSchemaFormDataProvider<Schema> {
    readonly name: "dynamics";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: BaseExternalContext): IonDynamicsDataManager;
    readonly uiSchema: {
        readonly numberOfSteps: {};
        readonly timeStep: {};
        readonly electronMass: {};
        readonly temperature: {};
    };
    readonly extraData: {};
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: BaseExternalContext);
    getDefaultData(): {
        numberOfSteps: number;
        timeStep: number;
        electronMass: number;
        temperature: number;
    };
}
export {};
