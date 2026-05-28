"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/boundary-conditions-data-provider";
// TODO: move to esse
var BoundaryConditionsType;
(function (BoundaryConditionsType) {
    BoundaryConditionsType["pbc"] = "pbc";
    BoundaryConditionsType["bc1"] = "bc1";
    BoundaryConditionsType["bc2"] = "bc2";
    BoundaryConditionsType["bc3"] = "bc3";
})(BoundaryConditionsType || (BoundaryConditionsType = {}));
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
        var _a, _b, _c;
        const metadata = (_a = this.material) === null || _a === void 0 ? void 0 : _a.metadata;
        return {
            type: ((_b = metadata === null || metadata === void 0 ? void 0 : metadata.boundaryConditions) === null || _b === void 0 ? void 0 : _b.type) || BoundaryConditionsType.pbc,
            offset: ((_c = metadata === null || metadata === void 0 ? void 0 : metadata.boundaryConditions) === null || _c === void 0 ? void 0 : _c.offset) || 0,
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
