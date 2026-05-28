import { PERIODIC_TABLE } from "@exabyte-io/periodic-table.js";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { QEPwxContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { Material } from "@mat3ra/made";
import type { AtomicElementValue } from "@mat3ra/made/dist/js/basis/elements";
import type { JSONSchema7 } from "json-schema";
import path from "path";

import jobContextMixin, {
    type JobContextMixin,
    type JobExternalContext,
} from "../../../mixins/JobContextMixin";
import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../../mixins/MaterialContextMixin";
import materialsContextMixin, {
    type MaterialsContextMixin,
    type MaterialsExternalContext,
} from "../../../mixins/MaterialsContextMixin";
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
type Data = QEPwxContextProviderSchema;
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    MaterialExternalContext &
    JobExternalContext &
    MethodDataExternalContext &
    MaterialsExternalContext;

type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<JobContextMixin> &
    Constructor<MaterialContextMixin> &
    Constructor<MaterialsContextMixin> &
    Constructor<MethodDataContextMixin> &
    Constructor<WorkflowContextMixin>;

const jsonSchemaId = "context-providers-directory/by-application/qe-pwx-context-provider";

export default class QEPWXContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "input";

    readonly domain: Domain = "executable";

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(config: ContextItem<Data>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
    }

    private buildQEPWXContext(material: Material): Data {
        const { Basis: basis, Lattice: lattice } = material;
        const { job, workflow } = this;

        const ATOMIC_SPECIES = basis.uniqueElements.map((symbol) => {
            const pseudo = (this.methodData?.pseudo || []).find((p) => p.element === symbol);
            return {
                X: symbol,
                Mass_X: PERIODIC_TABLE[symbol].atomic_mass,
                PseudoPot_X: pseudo?.filename || path.basename(pseudo?.path || ""),
            };
            // return s.sprintf("%s %f %s", symbol, el.atomic_mass, filename) || "";
        }); // .join("\n");

        const uniqueElementsWithLabels = [...new Set(basis.elementsWithLabelsArray)];

        const ATOMIC_SPECIES_WITH_LABELS = uniqueElementsWithLabels.map((symbol) => {
            const symbolWithoutLabel = symbol.replace(/\d$/, "") as AtomicElementValue;
            const label = symbol.match(/\d$/g) ? symbol.match(/\d$/g)?.[0] : "";
            const pseudo = (this.methodData?.pseudo || []).find(
                (p) => p.element === symbolWithoutLabel,
            );
            return {
                X: `${symbolWithoutLabel}${label}`,
                Mass_X: PERIODIC_TABLE[symbol].atomic_mass,
                PseudoPot_X: pseudo?.filename || path.basename(pseudo?.path || ""),
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
        const ATOMIC_POSITIONS = basis.elementsCoordinatesConstraintsArray.map(
            ([element, label, coordinate, constraint]) => {
                return {
                    X: `${element}${label}`,
                    x: coordinate[0],
                    y: coordinate[1],
                    z: coordinate[2],
                    "if_pos(1)": constraint[0] ? 1 : 0,
                    "if_pos(2)": constraint[1] ? 1 : 0,
                    "if_pos(3)": constraint[2] ? 1 : 0,
                };
            },
        );

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

    private getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1) return {};
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

materialContextMixin(QEPWXContextProvider.prototype);
materialsContextMixin(QEPWXContextProvider.prototype);
methodDataContextMixin(QEPWXContextProvider.prototype);
workflowContextMixin(QEPWXContextProvider.prototype);
jobContextMixin(QEPWXContextProvider.prototype);
