import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { HubbardJContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { ContextItem } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";

type Name = "hubbard_j";
type Data = HubbardJContextProviderSchema;

const defaultHubbardConfig = {
    paramType: "J" as const,
    atomicSpecies: "",
    atomicOrbital: "2p",
    value: 1.0,
};

const jsonSchemaId = "context-providers-directory/hubbard-j-context-provider";

export default class HubbardJContextProvider extends HubbardContextProvider<Name, Data> {
    readonly name: Name = "hubbard_j";

    readonly uiSchemaStyled = {
        "ui:options": {
            addable: true,
            orderable: true,
            removable: true,
        },
    };

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(contextItem: ContextItem<Data>, externalContext: HubbardExternalContext) {
        super(contextItem, externalContext);

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
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
