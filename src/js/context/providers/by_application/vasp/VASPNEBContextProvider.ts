import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { VASPNEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
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
import materialsSetContextMixin, {
    type MaterialsSetContextMixin,
} from "../../../mixins/MaterialsSetContextMixin";
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
import VASPContextProvider from "./VASPContextProvider";

type Name = "input";
type Data = VASPNEBContextProviderSchema;
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    JobExternalContext &
    MaterialExternalContext &
    MethodDataExternalContext &
    MaterialsContextMixin &
    MaterialsSetContextMixin;

type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<JobContextMixin> &
    Constructor<MaterialContextMixin> &
    Constructor<MaterialsContextMixin> &
    Constructor<MaterialsSetContextMixin> &
    Constructor<MethodDataContextMixin> &
    Constructor<WorkflowContextMixin>;

const jsonSchemaId = "context-providers-directory/by-application/vasp-neb-context-provider";

export default class VASPNEBContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "input";

    readonly domain: Domain = "executable";

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(config: ContextItem<Data>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialsSetContextMixin(externalContext);
        this.initMethodDataContextMixin(externalContext);
        this.initWorkflowContextMixin(externalContext);
        this.initJobContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
    }

    getDefaultData() {
        const VASPContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new VASPContextProvider({}, { ...this.externalContext, material }).getData();
        });

        return {
            FIRST_IMAGE: VASPContexts[0].POSCAR_WITH_CONSTRAINTS,
            LAST_IMAGE: VASPContexts[VASPContexts.length - 1].POSCAR_WITH_CONSTRAINTS,
            INTERMEDIATE_IMAGES: VASPContexts.slice(1, VASPContexts.length - 1).map((data) => {
                return data.POSCAR_WITH_CONSTRAINTS;
            }),
        };
    }
}

materialContextMixin(VASPNEBContextProvider.prototype);
materialsContextMixin(VASPNEBContextProvider.prototype);
materialsSetContextMixin(VASPNEBContextProvider.prototype);
methodDataContextMixin(VASPNEBContextProvider.prototype);
workflowContextMixin(VASPNEBContextProvider.prototype);
jobContextMixin(VASPNEBContextProvider.prototype);
