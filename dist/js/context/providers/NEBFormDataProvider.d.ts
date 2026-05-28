import type { NEBDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { ContextItem, Domain } from "./base/ContextProvider";
import type { JinjaExternalContext } from "./base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "./base/JSONSchemaFormDataProvider";
type Name = "neb";
type Data = NEBDataProviderSchema;
type ExternalContext = JinjaExternalContext;
export default class NEBFormDataProvider extends JSONSchemaFormDataProvider<Name, Data> {
    readonly name: Name;
    readonly domain: Domain;
    readonly uiSchema: {
        nImages: {};
    };
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): {
        nImages: number;
    };
}
export {};
