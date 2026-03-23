import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { MlTrainTestSplitContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import { type UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Schema = MlTrainTestSplitContextItemSchema;
type ExternalContext = JinjaExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext>;

const jsonSchemaId = "context-providers-directory/ml-train-test-split-context-provider";

const defaultData = {
    fraction_held_as_test_set: 0.2,
};

export default class MLTrainTestSplitDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "mlTrainTestSplit" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "mlTrainTestSplit");

        return new MLTrainTestSplitDataManager(contextItem, externalContext);
    }

    readonly jsonSchema: JSONSchema7 | undefined;

    readonly uiSchema = {
        target_column_name: {},
        problem_category: {},
    } as const;

    readonly extraData = {};

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            fraction_held_as_test_set: { default: defaultData.fraction_held_as_test_set },
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
