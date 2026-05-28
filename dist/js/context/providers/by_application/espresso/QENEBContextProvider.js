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
const QEPWXContextProvider_1 = __importDefault(require("./QEPWXContextProvider"));
const jsonSchemaId = "context-providers-directory/by-application/qe-neb-context-provider";
class QENEBContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.initJobContextMixin(externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initMaterialsSetContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
    }
    getDefaultData() {
        const PWXContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new QEPWXContextProvider_1.default({}, { ...this.externalContext, material }).getData();
        });
        const { ATOMIC_POSITIONS, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: _, ...rest } = PWXContexts[0];
        return {
            ...rest,
            FIRST_IMAGE: ATOMIC_POSITIONS,
            LAST_IMAGE: PWXContexts[PWXContexts.length - 1].ATOMIC_POSITIONS,
            INTERMEDIATE_IMAGES: PWXContexts.slice(1, PWXContexts.length - 1).map((data) => {
                return data.ATOMIC_POSITIONS;
            }),
        };
    }
}
exports.default = QENEBContextProvider;
(0, MaterialContextMixin_1.default)(QENEBContextProvider.prototype);
(0, MaterialsContextMixin_1.default)(QENEBContextProvider.prototype);
(0, MethodDataContextMixin_1.default)(QENEBContextProvider.prototype);
(0, WorkflowContextMixin_1.default)(QENEBContextProvider.prototype);
(0, JobContextMixin_1.default)(QENEBContextProvider.prototype);
(0, MaterialsSetContextMixin_1.default)(QENEBContextProvider.prototype);
