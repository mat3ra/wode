import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { MLSettingsContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import {
    type ApplicationContextMixin,
    applicationContextMixin,
} from "../mixins/ApplicationContextMixin";
import { type ContextItem, type Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Name = "mlSettings";
type Data = MLSettingsContextProviderSchema;
type ExternalContext = JinjaExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<ApplicationContextMixin>;

const jsonSchemaId = "context-providers-directory/ml-settings-context-provider";

const defaultData = {
    target_column_name: "target",
    problem_category: "regression" as const,
};

export default class MLSettingsContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "mlSettings";

    readonly domain: Domain = "important";

    readonly jsonSchema: JSONSchema7 | undefined;

    readonly uiSchema = {
        target_column_name: {},
        problem_category: {},
    };

    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initApplicationContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            target_column_name: { default: defaultData.target_column_name },
            problem_category: { default: defaultData.problem_category },
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}

applicationContextMixin(MLSettingsContextProvider.prototype);
