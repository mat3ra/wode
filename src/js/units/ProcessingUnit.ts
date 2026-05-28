import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ProcessingUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitType } from "../enums";
import {
    type ProcessingUnitSchemaMixin,
    processingUnitSchemaMixin,
} from "../generated/ProcessingUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = ProcessingUnitSchema;
type Base = typeof BaseUnit<Schema> & Constructor<ProcessingUnitSchemaMixin>;

export class ProcessingUnit extends (BaseUnit as Base) implements Schema {
    constructor(config: Partial<Schema>) {
        super({
            name: UnitType.processing,
            type: UnitType.processing,
            ...config,
        });
    }

    setOperation(op: ProcessingUnitSchema["operation"]) {
        this.setProp("operation", op);
    }

    setOperationType(type: ProcessingUnitSchema["operationType"]) {
        this.setProp("operationType", type);
    }

    setInput(input: ProcessingUnitSchema["inputData"]) {
        this.setProp("inputData", input);
    }
}

processingUnitSchemaMixin(ProcessingUnit.prototype);
