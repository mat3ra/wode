import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { MLTrainTestSplitContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import {
    type ApplicationContextMixin,
    applicationContextMixin,
} from "../mixins/ApplicationContextMixin";
import { type ContextItem, type Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Name = "mlTrainTestSplit";
type Data = MLTrainTestSplitContextProviderSchema;
type ExternalContext = JinjaExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<Name, Data> & Constructor<ApplicationContextMixin>;

const jsonSchemaId = "context-providers-directory/ml-train-test-split-context-provider";

const defaultData = {
    fraction_held_as_test_set: 0.2,
};

export default class MLTrainTestSplitContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "mlTrainTestSplit";

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
            fraction_held_as_test_set: { default: defaultData.fraction_held_as_test_set },
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}

applicationContextMixin(MLTrainTestSplitContextProvider.prototype);
