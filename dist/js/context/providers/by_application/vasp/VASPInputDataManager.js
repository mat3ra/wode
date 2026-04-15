"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/vasp-context-provider";
class VASPInputDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "input");
        return new VASPInputDataManager(contextItem, externalContext);
    }
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.entityName = "unit";
        this.isEdited = false;
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        const jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
        if (!jsonSchema) {
            throw new Error("Failed to get JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    // eslint-disable-next-line class-methods-use-this
    buildVASPContext(material) {
        return {
            // TODO: figure out whether we need two separate POSCARS, maybe one is enough
            POSCAR: material.getAsPOSCAR(true, true),
            POSCAR_WITH_CONSTRAINTS: material.getAsPOSCAR(true),
            contextProviderName: "vasp",
        };
    }
    getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1)
            return {};
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
(0, MaterialContextMixin_1.default)(VASPInputDataManager.prototype);
(0, MaterialsContextMixin_1.default)(VASPInputDataManager.prototype);
exports.default = VASPInputDataManager;
