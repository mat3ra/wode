"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const periodic_table_js_1 = require("@exabyte-io/periodic-table.js");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const MaterialContextMixin_1 = __importDefault(require("../../../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../../base/JSONSchemaDataProvider"));
const jsonSchemaId = "context-providers-directory/by-application/nwchem-total-energy-context-provider";
class NWChemInputDataManager extends JSONSchemaDataProvider_1.default {
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "input");
        return new NWChemInputDataManager(contextItem, externalContext);
    }
    constructor(config, externalContext) {
        super(config, externalContext);
        this.name = "input";
        this.domain = "executable";
        this.entityName = "unit";
        this.isEdited = false;
        this.contextProviderName = "nwchem-total-energy";
        this.initMaterialContextMixin(externalContext);
        const jsonSchema = JSONSchemasInterface_1.default.getSchemaById(jsonSchemaId);
        if (!jsonSchema) {
            throw new Error("Failed to get JSON schema");
        }
        this.jsonSchema = jsonSchema;
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
            contextProviderName: this.contextProviderName,
        };
    }
}
(0, MaterialContextMixin_1.default)(NWChemInputDataManager.prototype);
exports.default = NWChemInputDataManager;
