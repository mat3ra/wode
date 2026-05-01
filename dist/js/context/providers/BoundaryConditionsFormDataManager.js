"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/boundary-conditions-data-provider";
class BoundaryConditionsFormDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "boundaryConditions");
        return new BoundaryConditionsFormDataManager(contextItem, externalContext);
    }
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "boundaryConditions";
        this.domain = "important";
        this.entityName = "unit";
        this.humanName = "Boundary Conditions";
        this.uiSchema = {
            type: { "ui:disabled": true },
            offset: { "ui:disabled": true },
            electricField: {},
            targetFermiEnergy: {},
        };
        this.initMaterialContextMixin(externalContext);
    }
    getDefaultData() {
        var _a, _b, _c, _d, _e, _f;
        return {
            type: ((_c = (_b = (_a = this.material) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.boundaryConditions) === null || _c === void 0 ? void 0 : _c.type) || "pbc",
            offset: ((_f = (_e = (_d = this.material) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.boundaryConditions) === null || _f === void 0 ? void 0 : _f.offset) || 0,
            electricField: 0,
            targetFermiEnergy: 0,
        };
    }
    get jsonSchema() {
        const defaults = this.getDefaultData();
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            type: { default: defaults.type },
            offset: { default: defaults.offset },
            electricField: { default: defaults.electricField },
            targetFermiEnergy: { default: defaults.targetFermiEnergy },
        });
        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }
        return jsonSchema;
    }
}
(0, MaterialContextMixin_1.default)(BoundaryConditionsFormDataManager.prototype);
exports.default = BoundaryConditionsFormDataManager;
