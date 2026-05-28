import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { BoundaryConditionsDataProviderSchema } from "@mat3ra/esse/dist/js/types";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Name = "boundaryConditions";
type Data = BoundaryConditionsDataProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<MaterialContextMixin>;

const jsonSchemaId = "context-providers-directory/boundary-conditions-data-provider";

export default class BoundaryConditionsFormDataProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "boundaryConditions";

    readonly domain: Domain = "important";

    readonly humanName = "Boundary Conditions";

    readonly uiSchema = {
        type: { "ui:disabled": true },
        offset: { "ui:disabled": true },
        electricField: {},
        targetFermiEnergy: {},
    };

    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
    }

    getDefaultData(): Data {
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

    get jsonSchema() {
        const defaults = this.getDefaultData();
        return JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            type: { default: defaults.type },
            offset: { default: defaults.offset },
            electricField: { default: defaults.electricField },
            targetFermiEnergy: { default: defaults.targetFermiEnergy },
        });
    }
}

materialContextMixin(BoundaryConditionsFormDataProvider.prototype);
