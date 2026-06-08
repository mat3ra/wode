"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitFactory = void 0;
const enums_1 = require("../enums");
const AssertionUnit_1 = __importDefault(require("./AssertionUnit"));
const AssignmentUnit_1 = __importDefault(require("./AssignmentUnit"));
const ConditionUnit_1 = __importDefault(require("./ConditionUnit"));
const ErrorUnit_1 = __importDefault(require("./ErrorUnit"));
const ExecutionUnit_1 = __importDefault(require("./ExecutionUnit"));
const IOUnit_1 = __importDefault(require("./IOUnit"));
const MapUnit_1 = __importDefault(require("./MapUnit"));
const ReduceUnit_1 = __importDefault(require("./ReduceUnit"));
const SubworkflowUnit_1 = __importDefault(require("./SubworkflowUnit"));
class UnitFactory {
    static createDefaultSubworkflowUnit(type, application) {
        if (type === "execution") {
            if (application === undefined) {
                throw new Error("UnitFactory.createDefaultSubworkflowUnit: application is required when type is execution");
            }
            return new ExecutionUnit_1.default({
                type: enums_1.UnitType.execution,
                application,
            });
        }
        switch (type) {
            case "assignment":
                return new AssignmentUnit_1.default({ type: enums_1.UnitType.assignment });
            case "condition":
                return new ConditionUnit_1.default({ type: enums_1.UnitType.condition });
            case "io":
                return new IOUnit_1.default({ type: enums_1.UnitType.io });
            case "assertion":
                return new AssertionUnit_1.default({ type: enums_1.UnitType.assertion });
            default: {
                const unreachable = type;
                throw new Error(`Unexpected unit type: ${String(unreachable)}`);
            }
        }
    }
    static createInWorkflow(config) {
        switch (config.type) {
            case enums_1.UnitType.map:
                return new MapUnit_1.default(config);
            case enums_1.UnitType.subworkflow:
                return new SubworkflowUnit_1.default(config);
            case enums_1.UnitType.reduce:
                return new ReduceUnit_1.default(config);
            case enums_1.UnitType.error:
                return new ErrorUnit_1.default(config);
            default:
                throw new Error(`Unknown unit type: ${config.type}`);
        }
    }
    static createInSubworkflow(config) {
        switch (config.type) {
            case enums_1.UnitType.execution:
                return new ExecutionUnit_1.default(config);
            case enums_1.UnitType.assignment:
                return new AssignmentUnit_1.default(config);
            case enums_1.UnitType.condition:
                return new ConditionUnit_1.default(config);
            case enums_1.UnitType.io:
                return new IOUnit_1.default(config);
            case enums_1.UnitType.assertion:
                return new AssertionUnit_1.default(config);
            case enums_1.UnitType.error:
                return new ErrorUnit_1.default(config);
            default:
                throw new Error(`Unknown unit type: ${config.type}`);
        }
    }
}
exports.UnitFactory = UnitFactory;
