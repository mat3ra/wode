"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const periodic_table_js_1 = require("@exabyte-io/periodic-table.js");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const path_1 = __importDefault(require("path"));
const JobContextMixin_1 = __importDefault(require("../../../mixins/JobContextMixin"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MaterialsContextMixin_1 = __importDefault(require("../../../mixins/MaterialsContextMixin"));
const MethodDataContextMixin_1 = __importDefault(require("../../../mixins/MethodDataContextMixin"));
const WorkflowContextMixin_1 = __importDefault(require("../../../mixins/WorkflowContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/qe-pwx-context-provider";
class QEPWXContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.initMaterialsContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
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
            // return s.sprintf("%s %f %s", symbol, el.atomic_mass, filename) || "";
        }); // .join("\n");
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
            // return s.sprintf("%s%s %f %s", symbol, label, el.atomic_mass, filename) || "";
        }); // .join("\n");
        // Format numbers with 14 total width, 9 decimal places (equivalent to %14.9f)
        // const formatNumber = (num: number) => {
        //     return Number(num.toFixed(9).padStart(14).trim());
        // };
        const CELL_PARAMETERS = {
            v1: lattice.vectorArrays[0],
            v2: lattice.vectorArrays[1],
            v3: lattice.vectorArrays[2],
        };
        // const ATOMIC_POSITIONS = basis.getAtomicPositionsWithConstraintsAsStrings().join("\n");
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
            IBRAV: 0, // use CELL_PARAMETERS to define Bravais lattice
            RESTART_MODE: job.parent || workflow.hasRelaxation ? "restart" : "from_scratch",
            ATOMIC_SPECIES,
            ATOMIC_SPECIES_WITH_LABELS,
            NAT: basis.atomicPositions.length,
            NTYP: basis.uniqueElements.length,
            NTYP_WITH_LABELS: uniqueElementsWithLabels.length,
            ATOMIC_POSITIONS,
            ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: basis.atomicPositions.join("\n"),
            CELL_PARAMETERS,
        };
    }
    getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1)
            return {};
        return { perMaterial: this.materials.map((material) => this.buildQEPWXContext(material)) };
    }
    getDefaultData() {
        // the below values are read from PlanewaveDataManager instead
        // ECUTWFC = 40;
        // ECUTRHO = 200;
        return {
            ...this.buildQEPWXContext(this.material),
            ...this.getDataPerMaterial(),
        };
    }
}
exports.default = QEPWXContextProvider;
(0, MaterialContextMixin_1.default)(QEPWXContextProvider.prototype);
(0, MaterialsContextMixin_1.default)(QEPWXContextProvider.prototype);
(0, MethodDataContextMixin_1.default)(QEPWXContextProvider.prototype);
(0, WorkflowContextMixin_1.default)(QEPWXContextProvider.prototype);
(0, JobContextMixin_1.default)(QEPWXContextProvider.prototype);
