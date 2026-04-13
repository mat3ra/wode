import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    HubbardUContextItemSchema,
    HubbardUContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { UnitContext } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";

type Schema = HubbardUContextItemSchema;
type Data = HubbardUContextProviderSchema;

const defaultHubbardConfig = {
    atomicSpecies: "",
    atomicOrbital: "2p",
    hubbardUValue: 1.0,
};

const jsonSchemaId = "context-providers-directory/hubbard-u-context-provider";

export default class HubbardUContextManager extends HubbardContextProvider<Schema> {
    readonly name = "hubbard_u" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: HubbardExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "hubbard_u");

        return new HubbardUContextManager(contextItem, externalContext);
    }

    readonly uiSchemaStyled = {
        "ui:options": {
            addable: true,
            orderable: false,
            removable: true,
        },
    } as const;

    readonly jsonSchema: JSONSchema7;

    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext) {
        super(contextItem, externalContext);

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.hubbardUValue": {
                default: defaultHubbardConfig.hubbardUValue,
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
