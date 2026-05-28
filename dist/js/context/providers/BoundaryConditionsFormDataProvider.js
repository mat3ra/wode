"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("./base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/boundary-conditions-data-provider";
class BoundaryConditionsFormDataProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.name = "boundaryConditions";
        this.domain = "important";
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
    // yieldDataForRendering() {
    //     const data = Utils.clone.deepClone(this.getContextItem());
    //     data.boundaryConditions.offset *= Made.coefficients.ANGSTROM_TO_BOHR;
    //     data.boundaryConditions.targetFermiEnergy *= Made.coefficients.EV_TO_RY;
    //     data.boundaryConditions.electricField *= Made.coefficients.EV_A_TO_RY_BOHR;
    //     return data;
    // }
    get jsonSchema() {
        const defaults = this.getDefaultData();
        return JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            type: { default: defaults.type },
            offset: { default: defaults.offset },
            electricField: { default: defaults.electricField },
            targetFermiEnergy: { default: defaults.targetFermiEnergy },
        });
    }
}
exports.default = BoundaryConditionsFormDataProvider;
(0, MaterialContextMixin_1.default)(BoundaryConditionsFormDataProvider.prototype);
