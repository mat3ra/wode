"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JobContextMixin_1 = __importDefault(require("../../../mixins/JobContextMixin"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const MethodDataContextMixin_1 = __importDefault(require("../../../mixins/MethodDataContextMixin"));
const WorkflowContextMixin_1 = __importDefault(require("../../../mixins/WorkflowContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/vasp-context-provider";
class VASPContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.initJobContextMixin(externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
    }
    // eslint-disable-next-line class-methods-use-this
    buildVASPContext(material) {
        return {
            // TODO: figure out whether we need two separate POSCARS, maybe one is enough
            POSCAR: material.getAsPOSCAR(true, true),
            POSCAR_WITH_CONSTRAINTS: material.getAsPOSCAR(true),
        };
    }
    getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1)
            return {};
        // TODO-QUESTION: perMaterial is not defined in the schema
        return { perMaterial: this.materials.map((material) => this.buildVASPContext(material)) };
    }
    getDefaultData() {
        // consider adjusting so that below values are read from PlanewaveDataManager
        // ECUTWFC;
        // ECUTRHO;
        return {
            ...this.buildVASPContext(this.material),
            ...this.getDataPerMaterial(),
        };
    }
}
exports.default = VASPContextProvider;
(0, MaterialContextMixin_1.default)(VASPContextProvider.prototype);
(0, MaterialsContextMixin_1.default)(VASPContextProvider.prototype);
(0, MethodDataContextMixin_1.default)(VASPContextProvider.prototype);
(0, WorkflowContextMixin_1.default)(VASPContextProvider.prototype);
(0, JobContextMixin_1.default)(VASPContextProvider.prototype);
