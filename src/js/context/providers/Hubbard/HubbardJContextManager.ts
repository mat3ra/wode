import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    HubbardJContextItemSchema,
    HubbardJContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { UnitContext } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";

type Schema = HubbardJContextItemSchema;
type Data = HubbardJContextProviderSchema;

const defaultHubbardConfig = {
    paramType: "J" as const,
    atomicSpecies: "",
    atomicOrbital: "2p",
    value: 1.0,
};

const jsonSchemaId = "context-providers-directory/hubbard-j-context-provider";

export default class HubbardJContextManager extends HubbardContextProvider<Schema> {
    readonly name = "hubbard_j" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: HubbardExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "hubbard_j");

        return new HubbardJContextManager(contextItem, externalContext);
    }

    readonly uiSchemaStyled = {
        "ui:options": {
            addable: true,
            orderable: true,
            removable: true,
        },
    } as const;

    readonly jsonSchema: JSONSchema7;

    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext) {
        super(contextItem, externalContext);

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.paramType": {
                default: defaultHubbardConfig.paramType,
            },
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.value": {
                default: defaultHubbardConfig.value,
            },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    getDefaultData(): Data {
        return [
            {
                ...defaultHubbardConfig,
                atomicSpecies: this.firstElement,
            },
        ];
    }
}
