"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const periodic_table_js_1 = require("@exabyte-io/periodic-table.js");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const path_1 = __importDefault(require("path"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/qe-pwx-context-provider";
class QEPWXInputDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "input");
        return new QEPWXInputDataManager(contextItem, externalContext);
    }
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.entityName = "unit";
        this.isEdited = false;
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.methodData = externalContext.methodData || {};
        this.job = externalContext.job;
        this.workflow = externalContext.workflow;
        const jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
        if (!jsonSchema) {
            throw new Error("Failed to get JSON schema");
        }
        this.jsonSchema = jsonSchema;
    }
    buildQEPWXContext(material) {
        const { Basis: basis, Lattice: lattice } = material;
        const { job, workflow } = this;
        const ATOMIC_SPECIES = basis.uniqueElements.map((symbol) => {
            var _a;
            const pseudo = (((_a = this.methodData) === null || _a === void 0 ? void 0 : _a.pseudo) || []).find((p) => p.element === symbol);
            return {
                X: symbol,
                Mass_X: periodic_table_js_1.PERIODIC_TABLE[symbol].atomic_mass,
                PseudoPot_X: (pseudo === null || pseudo === void 0 ? void 0 : pseudo.filename) || path_1.default.basename((pseudo === null || pseudo === void 0 ? void 0 : pseudo.path) || ""),
            };
        });
        const uniqueElementsWithLabels = [...new Set(basis.elementsWithLabelsArray)];
        const ATOMIC_SPECIES_WITH_LABELS = uniqueElementsWithLabels.map((symbol) => {
            var _a, _b;
            const symbolWithoutLabel = symbol.replace(/\d$/, "");
            const label = symbol.match(/\d$/g) ? (_a = symbol.match(/\d$/g)) === null || _a === void 0 ? void 0 : _a[0] : "";
            const pseudo = (((_b = this.methodData) === null || _b === void 0 ? void 0 : _b.pseudo) || []).find((p) => p.element === symbolWithoutLabel);
            return {
                X: `${symbolWithoutLabel}${label}`,
                Mass_X: periodic_table_js_1.PERIODIC_TABLE[symbol].atomic_mass,
                PseudoPot_X: (pseudo === null || pseudo === void 0 ? void 0 : pseudo.filename) || path_1.default.basename((pseudo === null || pseudo === void 0 ? void 0 : pseudo.path) || ""),
            };
        });
        const CELL_PARAMETERS = {
            v1: lattice.vectorArrays[0],
            v2: lattice.vectorArrays[1],
            v3: lattice.vectorArrays[2],
        };
        const ATOMIC_POSITIONS = basis.elementsCoordinatesConstraintsArray.map(([element, label, coordinate, constraint]) => {
            return {
                X: `${element}${label}`,
                x: coordinate[0],
                y: coordinate[1],
                z: coordinate[2],
                "if_pos(1)": constraint[0] ? 1 : 0,
                "if_pos(2)": constraint[1] ? 1 : 0,
                "if_pos(3)": constraint[2] ? 1 : 0,
            };
        });
        return {
            IBRAV: 0,
            RESTART_MODE: (job === null || job === void 0 ? void 0 : job.parent) || workflow.hasRelaxation ? "restart" : "from_scratch",
            ATOMIC_SPECIES,
            ATOMIC_SPECIES_WITH_LABELS,
            NAT: basis.atomicPositions.length,
            NTYP: basis.uniqueElements.length,
            NTYP_WITH_LABELS: uniqueElementsWithLabels.length,
            ATOMIC_POSITIONS,
            ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: basis.atomicPositions.join("\n"),
            CELL_PARAMETERS,
            contextProviderName: "qe-pwx",
        };
    }
    getDefaultData() {
        // the below values are read from PlanewaveDataManager instead
        // ECUTWFC = 40;
        // ECUTRHO = 200;
        return {
            ...this.buildQEPWXContext(this.material),
            perMaterial: this.materials.map((material) => this.buildQEPWXContext(material)),
        };
    }
}
exports.default = QEPWXInputDataManager;
(0, MaterialContextMixin_1.default)(QEPWXInputDataManager.prototype);
(0, MaterialsContextMixin_1.default)(QEPWXInputDataManager.prototype);
// methodDataContextMixin(QEPWXInputDataManager.prototype);
// workflowContextMixin(QEPWXInputDataManager.prototype);
// jobContextMixin(QEPWXInputDataManager.prototype);
