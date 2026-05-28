"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const ApplicationContextMixin_1 = require("../mixins/ApplicationContextMixin");
const ContextProvider_1 = __importDefault(require("./base/ContextProvider"));
const cutoffConfig = {
    vasp: { wavefunction: undefined, density: undefined },
    espresso: { wavefunction: 40, density: 200 },
};
const jsonSchemaId = "context-providers-directory/planewave-cutoffs-context-provider";
class PlanewaveCutoffsContextProvider extends ContextProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "cutoffs";
        this.domain = "important";
        this.entityName = "subworkflow";
        this.uiSchema = {
            wavefunction: {},
            density: {},
        };
        this.initApplicationContextMixin(externalContext);
        const { wavefunction, density } = this.getDefaultData();
        this.jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            wavefunction: { default: wavefunction },
            density: { default: density },
        });
    }
    getDefaultData() {
        // TODO-QUESTION: what if the application is not in the cutoffConfig?
        const { wavefunction, density } = cutoffConfig[this.application.name] || {};
        return {
            wavefunction,
            density,
        };
    }
}
exports.default = PlanewaveCutoffsContextProvider;
(0, ApplicationContextMixin_1.applicationContextMixin)(PlanewaveCutoffsContextProvider.prototype);
