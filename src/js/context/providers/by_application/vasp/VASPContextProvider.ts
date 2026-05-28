import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { VASPContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { Material } from "@mat3ra/made";
import type { JSONSchema7 } from "json-schema";

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
type Data = VASPContextProviderSchema;
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    JobExternalContext &
    MaterialExternalContext &
    MethodDataExternalContext &
    MaterialsContextMixin;

type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<JobContextMixin> &
    Constructor<MaterialContextMixin> &
    Constructor<MethodDataContextMixin> &
    Constructor<MaterialsContextMixin> &
    Constructor<WorkflowContextMixin>;

const jsonSchemaId = "context-providers-directory/by-application/vasp-context-provider";

export default class VASPContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "input";

    readonly domain: Domain = "executable";

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(config: ContextItem<Data>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initJobContextMixin(externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
    }

    // eslint-disable-next-line class-methods-use-this
    private buildVASPContext(material: Material): Data {
        return {
            // TODO: figure out whether we need two separate POSCARS, maybe one is enough
            POSCAR: material.getAsPOSCAR(true, true),
            POSCAR_WITH_CONSTRAINTS: material.getAsPOSCAR(true),
        };
    }

    private getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1) return {};

        // TODO-QUESTION: perMaterial is not defined in the schema
        return { perMaterial: this.materials.map((material) => this.buildVASPContext(material)) };
    }

    getDefaultData() {
        // consider adjusting so that below values are read from PlanewaveDataManager
        // ECUTWFC;
        // ECUTRHO;

        return {
            ...this.buildVASPContext(this.material),
            ...this.getDataPerMaterial(),
        };
    }
}

materialContextMixin(VASPContextProvider.prototype);
materialsContextMixin(VASPContextProvider.prototype);
methodDataContextMixin(VASPContextProvider.prototype);
workflowContextMixin(VASPContextProvider.prototype);
jobContextMixin(VASPContextProvider.prototype);
