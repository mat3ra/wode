import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { MlSettingsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import { type UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Schema = MlSettingsContextItemSchema;
type ExternalContext = JinjaExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext>;

const jsonSchemaId = "context-providers-directory/ml-settings-context-provider";

const defaultData = {
    target_column_name: "target",
    problem_category: "regression" as const,
};

export default class MLSettingsDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "mlSettings" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "mlSettings");

        return new MLSettingsDataManager(contextItem, externalContext);
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
            target_column_name: { default: defaultData.target_column_name },
            problem_category: { default: defaultData.problem_category },
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
