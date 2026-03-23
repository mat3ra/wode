import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    InputContextItemSchema,
    QENEBContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

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
    type MaterialsSetExternalContext,
} from "../../../mixins/MaterialsSetContextMixin";
import type { MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import type { WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, {
    type JinjaExternalContext,
} from "../../base/JSONSchemaDataProvider";
import QEPWXInputDataManager from "./QEPWXInputDataManager";

const jsonSchemaId = "context-providers-directory/by-application/qe-neb-context-provider";

type Data = QENEBContextProviderSchema;
type Schema = InputContextItemSchema & { data: Data };
type ExternalContext = JinjaExternalContext &
    WorkflowExternalContext &
    MaterialsExternalContext &
    MethodDataExternalContext &
    MaterialsSetExternalContext &
    MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin> &
    Constructor<MaterialsContextMixin> &
    Constructor<MaterialsSetContextMixin>;

export default class QENEBInputDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "input" as const;

    readonly domain = "executable" as const;

    readonly entityName = "unit" as const;

    isEdited = false;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "input");

        return new QENEBInputDataManager(contextItem, externalContext);
    }

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(config: Partial<Schema>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initMaterialsSetContextMixin(externalContext);

        this.jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);
    }

    getDefaultData(): Data {
        const PWXContexts = this.sortMaterialsByIndexInSet(this.materials).map((material) => {
            return new QEPWXInputDataManager({}, { ...this.externalContext, material }).getData();
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
            contextProviderName: "qe-neb" as const,
        };
    }
}

materialContextMixin(QENEBInputDataManager.prototype);
materialsContextMixin(QENEBInputDataManager.prototype);
materialsSetContextMixin(QENEBInputDataManager.prototype);
