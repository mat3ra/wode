import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { NebContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { UnitContext } from "./base/ContextProvider";
import type { JinjaExternalContext } from "./base/JSONSchemaDataProvider";
import JSONSchemaFormDataProvider from "./base/JSONSchemaFormDataProvider";

type Schema = NebContextItemSchema;
type ExternalContext = JinjaExternalContext;

const jsonSchemaId = "context-providers-directory/neb-data-provider";

const defaultData = {
    nImages: 1,
};

export default class NEBFormDataManager extends JSONSchemaFormDataProvider<Schema> {
    readonly name = "neb" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "neb");

        return new NEBFormDataManager(contextItem, externalContext);
    }

    readonly uiSchema = {
        nImages: {},
    } as const;

    readonly jsonSchema: JSONSchema7;

    readonly extraData = {};

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            nImages: { default: defaultData.nImages },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
