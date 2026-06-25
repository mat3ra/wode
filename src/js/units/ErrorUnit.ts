import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitStatus, UnitType } from "../enums";
import { type ErrorUnitSchemaMixin, errorUnitSchemaMixin } from "../generated/ErrorUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ErrorUnitSchema;

export type ErrorUnitConfig = Partial<Schema>;

interface ErrorUnit extends ErrorUnitSchemaMixin, Taggable {}

class ErrorUnit extends BaseUnit<Schema> implements Schema {
    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/error");
    }

    constructor(config: ErrorUnitConfig) {
        const schema = {
            name: UnitType.error,
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            reason: "",
            ...config,
            type: UnitType.error as Schema["type"],
            status: config.status ?? UnitStatus.error,
        };
        super(schema);
    }
}

errorUnitSchemaMixin(ErrorUnit.prototype);

export default ErrorUnit;
