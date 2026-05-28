"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const periodic_table_js_1 = require("@exabyte-io/periodic-table.js");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const JobContextMixin_1 = __importDefault(require("../../../mixins/JobContextMixin"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const MethodDataContextMixin_1 = __importDefault(require("../../../mixins/MethodDataContextMixin"));
const WorkflowContextMixin_1 = __importDefault(require("../../../mixins/WorkflowContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/nwchem-total-energy-context-provider";
class NWChemTotalEnergyContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
    }
    /*
     * TODO: Create ability for user to define CHARGE, MULT, BASIS and FUNCTIONAL parameters.
     */
    getDefaultData() {
        const basis = this.material.Basis;
        const NTYP = basis.uniqueElements.length;
        const ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS = basis.atomicPositions.join("\n") || "";
        const ATOMIC_SPECIES = basis.uniqueElements
            .map((symbol) => `${symbol} ${periodic_table_js_1.PERIODIC_TABLE[symbol].atomic_mass} `)
            .join("\n");
        basis.toCartesian();
        const atomicPositions = basis.getAtomicPositionsWithConstraintsAsStrings();
        return {
            CHARGE: 0,
            MULT: 1,
            BASIS: "6-31G",
            NAT: atomicPositions.length,
            NTYP,
            ATOMIC_POSITIONS: atomicPositions.join("\n"),
            ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS,
            ATOMIC_SPECIES,
            FUNCTIONAL: "B3LYP",
            CARTESIAN: basis.toCartesian !== undefined,
        };
    }
}
exports.default = NWChemTotalEnergyContextProvider;
(0, MaterialContextMixin_1.default)(NWChemTotalEnergyContextProvider.prototype);
(0, MethodDataContextMixin_1.default)(NWChemTotalEnergyContextProvider.prototype);
(0, WorkflowContextMixin_1.default)(NWChemTotalEnergyContextProvider.prototype);
(0, JobContextMixin_1.default)(NWChemTotalEnergyContextProvider.prototype);
