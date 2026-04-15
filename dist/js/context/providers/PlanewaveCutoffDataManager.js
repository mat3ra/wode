"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const ApplicationContextMixin_1 = __importDefault(require("../mixins/ApplicationContextMixin"));
const ContextProvider_1 = __importDefault(require("./base/ContextProvider"));
// Type guard to check if a string is a valid ApplicationName
function isApplicationName(name) {
    return name === "vasp" || name === "espresso";
}
// TODO: create a task to move this handling to standata
const cutoffConfig = {
    vasp: { wavefunction: undefined, density: undefined },
    espresso: { wavefunction: 40, density: 200 },
};
const defaultData = {
    wavefunction: undefined,
    density: undefined,
};
const jsonSchemaId = "context-providers-directory/planewave-cutoffs-context-provider";
class PlanewaveCutoffDataManager extends ContextProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "cutoffs");
        return new PlanewaveCutoffDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "cutoffs";
        this.domain = "important";
        this.entityName = "subworkflow";
        this.uiSchema = {
            wavefunction: {},
            density: {},
        };
        this.extraData = {};
        this.initApplicationContextMixin(externalContext);
        const { wavefunction, density } = this.getDefaultData();
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            wavefunction: { default: wavefunction },
            density: { default: density },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        const applicationName = this.application.name;
        // Type-safe check: ensure application name is valid and exists in config
        if (!isApplicationName(applicationName)) {
            // Fallback to default values if application is not supported
            return defaultData;
        }
        const config = cutoffConfig[applicationName];
        if (!config) {
            // Fallback to default values if application is not in cutoffConfig
            return defaultData;
        }
        const { wavefunction, density } = config;
        return {
            wavefunction: wavefunction !== null && wavefunction !== void 0 ? wavefunction : defaultData.wavefunction,
            density: density !== null && density !== void 0 ? density : defaultData.density,
        };
    }
}
(0, ApplicationContextMixin_1.default)(PlanewaveCutoffDataManager.prototype);
exports.default = PlanewaveCutoffDataManager;
