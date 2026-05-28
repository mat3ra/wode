import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { MLSettingsContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type ApplicationContextMixin } from "../mixins/ApplicationContextMixin";
import { type ContextItem, type Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Name = "mlSettings";
type Data = MLSettingsContextProviderSchema;
type ExternalContext = JinjaExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<ApplicationContextMixin>;
declare const MLSettingsContextProvider_base: Base;
export default class MLSettingsContextProvider extends MLSettingsContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    readonly uiSchema: {
        target_column_name: {};
        problem_category: {};
    };
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): {
        target_column_name: string;
        problem_category: "regression";
    };
}
export {};
