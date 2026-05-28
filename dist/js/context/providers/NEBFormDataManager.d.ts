import type { NebContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "./base/ContextProvider";
import type { JinjaExternalContext } from "./base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "./base/JSONSchemaFormDataProvider";
type Schema = NebContextItemSchema;
type ExternalContext = JinjaExternalContext;
export default class NEBFormDataManager extends JSONSchemaFormDataProvider<Schema> {
    readonly name: "neb";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): NEBFormDataManager;
    readonly uiSchema: {
        readonly nImages: {};
    };
    readonly jsonSchema: JSONSchema7;
    readonly extraData: {};
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): {
        nImages: number;
    };
}
export {};
