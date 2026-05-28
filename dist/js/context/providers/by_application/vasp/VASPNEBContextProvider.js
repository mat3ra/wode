"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JobContextMixin_1 = __importDefault(require("../../../mixins/JobContextMixin"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const MaterialsSetContextMixin_1 = __importDefault(require("../../../mixins/MaterialsSetContextMixin"));
const MethodDataContextMixin_1 = __importDefault(require("../../../mixins/MethodDataContextMixin"));
const WorkflowContextMixin_1 = __importDefault(require("../../../mixins/WorkflowContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const VASPContextProvider_1 = __importDefault(require("./VASPContextProvider"));
const jsonSchemaId = "context-providers-directory/by-application/vasp-neb-context-provider";
class VASPNEBContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.initMaterialContextMixin(externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialsSetContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
    }
    getDefaultData() {
        const VASPContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new VASPContextProvider_1.default({}, { ...this.externalContext, material }).getData();
        });
        return {
            FIRST_IMAGE: VASPContexts[0].POSCAR_WITH_CONSTRAINTS,
            LAST_IMAGE: VASPContexts[VASPContexts.length - 1].POSCAR_WITH_CONSTRAINTS,
            INTERMEDIATE_IMAGES: VASPContexts.slice(1, VASPContexts.length - 1).map((data) => {
                return data.POSCAR_WITH_CONSTRAINTS;
            }),
        };
    }
}
exports.default = VASPNEBContextProvider;
(0, MaterialContextMixin_1.default)(VASPNEBContextProvider.prototype);
(0, MaterialsContextMixin_1.default)(VASPNEBContextProvider.prototype);
(0, MaterialsSetContextMixin_1.default)(VASPNEBContextProvider.prototype);
(0, MethodDataContextMixin_1.default)(VASPNEBContextProvider.prototype);
(0, WorkflowContextMixin_1.default)(VASPNEBContextProvider.prototype);
(0, JobContextMixin_1.default)(VASPNEBContextProvider.prototype);
