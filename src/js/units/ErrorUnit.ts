import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitStatus, UnitType } from "../enums";
import { type ErrorUnitSchemaMixin, errorUnitSchemaMixin } from "../generated/ErrorUnitSchemaMixin";
import BaseUnit from "./BaseUnit";

type Schema = ErrorUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ErrorUnitSchemaMixin>;

export type ErrorUnitConfig = Partial<Schema>;

class ErrorUnit extends (BaseUnit as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

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
            originalUnit: {},
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
