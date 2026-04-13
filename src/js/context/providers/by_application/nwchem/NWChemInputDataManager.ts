import { PERIODIC_TABLE } from "@exabyte-io/periodic-table.js";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    InputContextItemSchema,
    NWChemTotalEnergyContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../../mixins/MaterialContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, {
    type JinjaExternalContext,
} from "../../base/JSONSchemaDataProvider";

type Data = NWChemTotalEnergyContextProviderSchema;
type Schema = InputContextItemSchema & { data: Data };
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin>;

const jsonSchemaId =
    "context-providers-directory/by-application/nwchem-total-energy-context-provider";

export default class NWChemInputDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "input" as const;

    readonly domain = "executable" as const;

    readonly entityName = "unit" as const;

    isEdited = false;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "input");

        return new NWChemInputDataManager(contextItem, externalContext);
    }

    readonly contextProviderName = "nwchem-total-energy" as const;

    readonly jsonSchema: JSONSchema7;

    constructor(config: Partial<Schema>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMaterialContextMixin(externalContext);

        const jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);

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
            .map((symbol) => `${symbol} ${PERIODIC_TABLE[symbol].atomic_mass} `)
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

materialContextMixin(NWChemInputDataManager.prototype);
