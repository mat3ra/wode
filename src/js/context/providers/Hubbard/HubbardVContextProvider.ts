import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { HubbardVContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { ContextItem } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";

type Name = "hubbard_v";
type Data = HubbardVContextProviderSchema;

const defaultHubbardConfig = {
    atomicSpecies: "",
    atomicOrbital: "2p",
    atomicSpecies2: "",
    atomicOrbital2: "2p",
    siteIndex: 1,
    siteIndex2: 1,
    hubbardVValue: 1.0,
};

const jsonSchemaId = "context-providers-directory/hubbard-v-context-provider";

export default class HubbardVContextProvider extends HubbardContextProvider<Name, Data> {
    readonly name: Name = "hubbard_v";

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
            "items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "items.properties.siteIndex": {
                default: defaultHubbardConfig.siteIndex,
            },
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.atomicSpecies2": {
                enum: this.uniqueElementsWithLabels,
                default: this.secondSpecies,
            },
            "items.properties.siteIndex2": {
                default:
                    this.uniqueElementsWithLabels?.length > 1 ? 2 : defaultHubbardConfig.siteIndex2,
            },
            "items.properties.atomicOrbital2": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.hubbardVValue": {
                default: defaultHubbardConfig.hubbardVValue,
            },
        });
    }

    getDefaultData(): Data {
        return [
            {
                ...defaultHubbardConfig,
                atomicSpecies: this.firstElement,
                atomicSpecies2: this.secondSpecies,
                siteIndex2:
                    this.uniqueElementsWithLabels?.length > 1 ? 2 : defaultHubbardConfig.siteIndex2,
            },
        ];
    }
}
