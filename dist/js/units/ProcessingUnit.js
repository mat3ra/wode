"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingUnit = void 0;
const enums_1 = require("../enums");
const ProcessingUnitSchemaMixin_1 = require("../generated/ProcessingUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class ProcessingUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({
            name: enums_1.UnitType.processing,
            type: enums_1.UnitType.processing,
            ...config,
        });
    }
    setOperation(op) {
        this.setProp("operation", op);
    }
    setOperationType(type) {
        this.setProp("operationType", type);
    }
    setInput(input) {
        this.setProp("inputData", input);
    }
}
exports.ProcessingUnit = ProcessingUnit;
(0, ProcessingUnitSchemaMixin_1.processingUnitSchemaMixin)(ProcessingUnit.prototype);
