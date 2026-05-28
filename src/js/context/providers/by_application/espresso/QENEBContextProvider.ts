import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { QENEBContextProviderSchema } from "@mat3ra/esse/dist/js/types";
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
    type MaterialsExternalContext,
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
import QEPWXContextProvider from "./QEPWXContextProvider";

const jsonSchemaId = "context-providers-directory/by-application/qe-neb-context-provider";

type Name = "input";
type Data = QENEBContextProviderSchema;
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    JobExternalContext &
    MaterialsExternalContext &
    MethodDataExternalContext &
    MaterialsSetContextMixin &
    MaterialExternalContext;

type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<JobContextMixin> &
    Constructor<MaterialContextMixin> &
    Constructor<MaterialsContextMixin> &
    Constructor<MaterialsSetContextMixin> &
    Constructor<WorkflowContextMixin> &
    Constructor<MethodDataContextMixin>;

export default class QENEBContextProvider extends (JSONSchemaDataProvider as Base) {
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
        this.initMaterialsSetContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
    }

    getDefaultData(): Data {
        const PWXContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new QEPWXContextProvider({}, { ...this.externalContext, material }).getData();
        });

        const {
            ATOMIC_POSITIONS,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: _,
            ...rest
        } = PWXContexts[0];

        return {
            ...rest,
            FIRST_IMAGE: ATOMIC_POSITIONS,
            LAST_IMAGE: PWXContexts[PWXContexts.length - 1].ATOMIC_POSITIONS,
            INTERMEDIATE_IMAGES: PWXContexts.slice(1, PWXContexts.length - 1).map((data) => {
                return data.ATOMIC_POSITIONS;
            }),
        };
    }
}

materialContextMixin(QENEBContextProvider.prototype);
materialsContextMixin(QENEBContextProvider.prototype);
methodDataContextMixin(QENEBContextProvider.prototype);
workflowContextMixin(QENEBContextProvider.prototype);
jobContextMixin(QENEBContextProvider.prototype);
materialsSetContextMixin(QENEBContextProvider.prototype);
