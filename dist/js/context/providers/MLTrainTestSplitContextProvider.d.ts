import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { MLTrainTestSplitContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type ApplicationContextMixin } from "../mixins/ApplicationContextMixin";
import { type ContextItem, type Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Name = "mlTrainTestSplit";
type Data = MLTrainTestSplitContextProviderSchema;
type ExternalContext = JinjaExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<Name, Data> & Constructor<ApplicationContextMixin>;
declare const MLTrainTestSplitContextProvider_base: Base;
export default class MLTrainTestSplitContextProvider extends MLTrainTestSplitContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    readonly uiSchema: {
        target_column_name: {};
        problem_category: {};
    };
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
    getDefaultData(): {
        fraction_held_as_test_set: number;
    };
}
export {};
