import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { InputContextItemSchema, VASPContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { Material } from "@mat3ra/made";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../../mixins/MaterialContextMixin";
import materialsContextMixin, {
    type MaterialsContextMixin,
    type MaterialsExternalContext,
} from "../../../mixins/MaterialsContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, {
    type JinjaExternalContext,
} from "../../base/JSONSchemaDataProvider";

type Data = VASPContextProviderSchema;
type Schema = InputContextItemSchema & { data: Data };
type ExternalContext = JinjaExternalContext & MaterialExternalContext & MaterialsExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin> &
    Constructor<MaterialsContextMixin>;

const jsonSchemaId = "context-providers-directory/by-application/vasp-context-provider";

export default class VASPInputDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "input" as const;

    readonly domain = "executable" as const;

    readonly entityName = "unit" as const;

    isEdited = false;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "input");

        return new VASPInputDataManager(contextItem, externalContext);
    }

    readonly jsonSchema: JSONSchema7;

    constructor(config: Partial<Schema>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.initMaterialsContextMixin(externalContext);
        this.initMaterialContextMixin(externalContext);

        const jsonSchema = JSONSchemasInterface.getSchemaById(jsonSchemaId);

        if (!jsonSchema) {
            throw new Error("Failed to get JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    // eslint-disable-next-line class-methods-use-this
    private buildVASPContext(material: Material): Data {
        return {
            // TODO: figure out whether we need two separate POSCARS, maybe one is enough
            POSCAR: material.getAsPOSCAR(true, true),
            POSCAR_WITH_CONSTRAINTS: material.getAsPOSCAR(true),
            contextProviderName: "vasp" as const,
        };
    }

    private getDataPerMaterial() {
        if (!this.materials || this.materials.length <= 1) return {};

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

materialContextMixin(VASPInputDataManager.prototype);
materialsContextMixin(VASPInputDataManager.prototype);
