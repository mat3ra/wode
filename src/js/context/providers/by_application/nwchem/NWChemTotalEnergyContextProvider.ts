import { PERIODIC_TABLE } from "@exabyte-io/periodic-table.js";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { NWChemTotalEnergyContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import jobContextMixin, {
    type JobContextMixin,
    type JobExternalContext,
} from "../../../mixins/JobContextMixin";
import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../../mixins/MaterialContextMixin";
import methodDataContextMixin, {
    type MethodDataContextMixin,
    type MethodDataExternalContext,
} from "../../../mixins/MethodDataContextMixin";
import workflowContextMixin, {
    type WorkflowContextMixin,
    type WorkflowExternalContext,
} from "../../../mixins/WorkflowContextMixin";
import type { ContextItem, Domain } from "../../base/ContextProvider";
import JSONSchemaDataProvider, {
    type JinjaExternalContext,
} from "../../base/JSONSchemaDataProvider";

type Name = "input";
type Data = NWChemTotalEnergyContextProviderSchema;
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    JobExternalContext &
    MethodDataExternalContext &
    MaterialExternalContext;

type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<JobContextMixin> &
    Constructor<MaterialContextMixin> &
    Constructor<MethodDataContextMixin> &
    Constructor<WorkflowContextMixin>;

const jsonSchemaId =
    "context-providers-directory/by-application/nwchem-total-energy-context-provider";

export default class NWChemTotalEnergyContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "input";

    readonly domain: Domain = "executable";

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(config: ContextItem<Data>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
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
        };
    }
}

materialContextMixin(NWChemTotalEnergyContextProvider.prototype);
methodDataContextMixin(NWChemTotalEnergyContextProvider.prototype);
workflowContextMixin(NWChemTotalEnergyContextProvider.prototype);
jobContextMixin(NWChemTotalEnergyContextProvider.prototype);
