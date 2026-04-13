"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const MaterialsSetContextMixin_1 = __importDefault(require("../../../mixins/MaterialsSetContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const QEPWXInputDataManager_1 = __importDefault(require("./QEPWXInputDataManager"));
const jsonSchemaId = "context-providers-directory/by-application/qe-neb-context-provider";
class QENEBInputDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "input");
        return new QENEBInputDataManager(contextItem, externalContext);
    }
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.entityName = "unit";
        this.isEdited = false;
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initMaterialsSetContextMixin(externalContext);
        const jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
        if (!jsonSchema) {
            throw new Error("Failed to get JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    getDefaultData() {
        const PWXContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new QEPWXInputDataManager_1.default({}, { ...this.externalContext, material }).getData();
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
            contextProviderName: "qe-neb",
        };
    }
}
exports.default = QENEBInputDataManager;
(0, MaterialContextMixin_1.default)(QENEBInputDataManager.prototype);
(0, MaterialsContextMixin_1.default)(QENEBInputDataManager.prototype);
(0, MaterialsSetContextMixin_1.default)(QENEBInputDataManager.prototype);
