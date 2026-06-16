"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairWorkflow = repairWorkflow;
const in_memory_1 = require("@mat3ra/code/dist/js/entity/in_memory");
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("../enums");
const Subworkflow_1 = __importDefault(require("../Subworkflow"));
const ConditionUnit_1 = __importDefault(require("../units/ConditionUnit"));
const ExecutionUnit_1 = __importDefault(require("../units/ExecutionUnit"));
function toErrorUnitSchema(unitData, error) {
    var _a, _b, _c, _d;
    let reasonPayload;
    if (error instanceof in_memory_1.EntityError && error.details) {
        reasonPayload = {
            error: error.details.error,
            json: unitData,
        };
    }
    else if (error instanceof Error) {
        reasonPayload = {
            error: { message: error.message, name: error.name },
            json: unitData,
        };
    }
    else {
        reasonPayload = {
            error,
            json: unitData,
        };
    }
    return {
        results: [],
        preProcessors: [],
        postProcessors: [],
        monitors: [],
        name: (_a = unitData.name) !== null && _a !== void 0 ? _a : enums_1.UnitType.error,
        type: enums_1.UnitType.error,
        status: enums_1.UnitStatus.error,
        flowchartId: (_b = unitData.flowchartId) !== null && _b !== void 0 ? _b : utils_1.Utils.uuid.getUUID(),
        reason: JSON.stringify(reasonPayload),
        next: (_c = unitData.next) !== null && _c !== void 0 ? _c : "",
        head: (_d = unitData.head) !== null && _d !== void 0 ? _d : false,
    };
}
function repairExecutionUnit(unitData) {
    try {
        return new ExecutionUnit_1.default(unitData).toJSON();
    }
    catch (error) {
        return toErrorUnitSchema(unitData, error);
    }
}
function repairConditionUnit(unitData) {
    try {
        return new ConditionUnit_1.default(unitData).toJSON();
    }
    catch (error) {
        return toErrorUnitSchema(unitData, error);
    }
}
function getSubworkflowValidationError(subworkflow) {
    // Two checks, same order as the old isValid() path (construct + validate), but split so we
    // keep AJV errors when hydration would fail first:
    // 1. validateData — JSON Schema on raw persisted subworkflow (no Application/ModelFactory/units).
    //    Surfaces structured AJV errors (e.g. missing model) before the constructor runs.
    // 2. new Subworkflow().validate() — hydration (app, model, units) then schema on the instance.
    //    Catches schema-valid JSON that still cannot be built (unknown model, bad units, etc.).
    try {
        Subworkflow_1.default.validateData({ ...subworkflow });
        new Subworkflow_1.default(subworkflow).validate();
        return null;
    }
    catch (error) {
        if (error instanceof in_memory_1.EntityError || error instanceof Error) {
            return error;
        }
        return new Error(String(error));
    }
}
function repairSubworkflow(subworkflowData) {
    const units = subworkflowData.units.map((unit) => {
        if (unit.type === enums_1.UnitType.execution) {
            return repairExecutionUnit(unit);
        }
        if (unit.type === enums_1.UnitType.condition) {
            return repairConditionUnit(unit);
        }
        return unit;
    });
    return { ...subworkflowData, units };
}
function repairWorkflow(workflowData) {
    const subworkflows = workflowData.subworkflows.map((subworkflow) => {
        return repairSubworkflow(subworkflow);
    });
    const invalidSubworkflows = subworkflows
        .map((subworkflow) => {
        const error = getSubworkflowValidationError(subworkflow);
        return error ? { subworkflow, error } : null;
    })
        .filter((entry) => entry !== null);
    const units = workflowData.units.map((unit) => {
        const invalidEntry = invalidSubworkflows.find(({ subworkflow }) => subworkflow._id === unit._id);
        if (invalidEntry) {
            const { subworkflow, error } = invalidEntry;
            const errorUnit = toErrorUnitSchema(unit, error);
            const reasonPayload = {
                ...JSON.parse(errorUnit.reason),
                json: { unit, subworkflow },
            };
            return {
                ...errorUnit,
                _id: unit._id,
                name: unit.name || errorUnit.name,
                flowchartId: unit.flowchartId,
                reason: JSON.stringify(reasonPayload),
                preProcessors: unit.preProcessors || [],
                postProcessors: unit.postProcessors || [],
                monitors: unit.monitors || [],
                results: unit.results || [],
            };
        }
        return unit;
    });
    const validSubworkflows = subworkflows.filter((subworkflow) => {
        return !invalidSubworkflows.some(({ subworkflow: invalid }) => invalid._id === subworkflow._id);
    });
    const workflows = workflowData.workflows.map((nested) => {
        return repairWorkflow(nested);
    });
    return {
        ...workflowData,
        subworkflows: validSubworkflows,
        workflows,
        units,
    };
}
