import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";

type Name = "qgrid";
type Schema = GridContextItemSchema;

export default class QGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name = "qgrid" as const;

    readonly jsonSchema: JSONSchema7;

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext, 5);

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(
            this.jsonSchemaId,
            this.jsonSchemaPatchConfig,
        );

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "qgrid");

        return new QGridFormDataManager(contextItem, externalContext);
    }
}
