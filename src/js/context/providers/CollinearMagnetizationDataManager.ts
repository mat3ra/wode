import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    CollinearMagnetizationContextItemSchema,
    CollinearMagnetizationContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
import { getAtomicSpeciesOfAtoms } from "./by_application/espresso/QEPWXInputDataManager";

type Data = CollinearMagnetizationContextProviderSchema;
type Schema = CollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CollinearMagnetizationDataManager extends MaterialContextMixin {}

const defaultData = {
    isTotalMagnetization: false,
    totalMagnetization: 0.0,
};

const jsonSchemaId = "context-providers-directory/collinear-magnetization-context-provider";

class CollinearMagnetizationDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
    readonly name = "collinearMagnetization" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "collinearMagnetization");

        return new CollinearMagnetizationDataManager(contextItem, externalContext);
    }

    readonly jsonSchema: JSONSchema7;

    private readonly isTotalMagnetization: boolean;

    private readonly startingMagnetization: Data["startingMagnetization"];

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);

        this.startingMagnetization = [
            ...new Set(getAtomicSpeciesOfAtoms(this.material.getBasis())),
        ].map(({ name, startingMagnetization }, index) => ({
            index: index + 1,
            atomicSpecies: name,
            value: startingMagnetization,
        }));

        this.isTotalMagnetization = this.data?.isTotalMagnetization || false;

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "properties.isTotalMagnetization": {
                default: defaultData.isTotalMagnetization,
            },
            "properties.totalMagnetization": {
                default: defaultData.totalMagnetization,
            },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    getDefaultData(): Data {
        return {
            startingMagnetization: this.startingMagnetization,
            isTotalMagnetization: defaultData.isTotalMagnetization,
            totalMagnetization: defaultData.totalMagnetization,
        };
    }

    protected patchForRendering(data: Data): Data {
        return { ...data, startingMagnetization: this.startingMagnetization };
    }

    get uiSchemaStyled() {
        return {
            startingMagnetization: {
                items: {
                    atomicSpecies: {
                        "ui:classNames": "col-xs-3",
                    },
                    value: {
                        "ui:classNames": "col-xs-6",
                    },
                },
                "ui:readonly": true,
            },
            isTotalMagnetization: {},
            totalMagnetization: {
                "ui:classNames": "col-xs-6",
                "ui:readonly": !this.isTotalMagnetization,
            },
        };
    }
}

materialContextMixin(CollinearMagnetizationDataManager.prototype);

export default CollinearMagnetizationDataManager;
