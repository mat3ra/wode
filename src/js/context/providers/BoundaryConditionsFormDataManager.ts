import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { BoundaryConditionsContextItemSchema } from "@mat3ra/esse/dist/js/types";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Schema = BoundaryConditionsContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;

type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin>;

const jsonSchemaId = "context-providers-directory/boundary-conditions-data-provider";

export default class BoundaryConditionsFormDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "boundaryConditions" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "boundaryConditions");

        return new BoundaryConditionsFormDataManager(contextItem, externalContext);
    }

    readonly humanName = "Boundary Conditions" as const;

    readonly uiSchema = {
        type: { "ui:disabled": true },
        offset: { "ui:disabled": true },
        electricField: {},
        targetFermiEnergy: {},
    } as const;

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
    }

    getDefaultData(): Schema["data"] {
        return {
            type: this.material?.metadata?.boundaryConditions?.type || "pbc",
            offset: this.material?.metadata?.boundaryConditions?.offset || 0,
            electricField: 0,
            targetFermiEnergy: 0,
        };
    }

    // yieldDataForRendering() {
    //     const data = Utils.clone.deepClone(this.getContextItem());
    //     data.boundaryConditions.offset *= Made.coefficients.ANGSTROM_TO_BOHR;
    //     data.boundaryConditions.targetFermiEnergy *= Made.coefficients.EV_TO_RY;
    //     data.boundaryConditions.electricField *= Made.coefficients.EV_A_TO_RY_BOHR;
    //     return data;
    // }

    get jsonSchema(): JSONSchema {
        const defaults = this.getDefaultData();
        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            type: { default: defaults.type },
            offset: { default: defaults.offset },
            electricField: { default: defaults.electricField },
            targetFermiEnergy: { default: defaults.targetFermiEnergy },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        return jsonSchema;
    }
}

materialContextMixin(BoundaryConditionsFormDataManager.prototype);
