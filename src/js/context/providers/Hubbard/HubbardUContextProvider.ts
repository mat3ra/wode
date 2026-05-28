import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { HubbardUContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin from "../../mixins/MaterialContextMixin";
import type { ContextItem } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";

type Name = "hubbard_u";
type Data = HubbardUContextProviderSchema;

const defaultHubbardConfig = {
    atomicSpecies: "",
    atomicOrbital: "2p",
    hubbardUValue: 1.0,
};

const jsonSchemaId = "context-providers-directory/hubbard-u-context-provider";

export default class HubbardUContextProvider extends HubbardContextProvider<Name, Data> {
    readonly name: Name = "hubbard_u";

    readonly uiSchemaStyled = {
        "ui:options": {
            addable: true,
            orderable: false,
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
            "items.properties.atomicOrbital": {
                enum: this.orbitalList,
                default: defaultHubbardConfig.atomicOrbital,
            },
            "items.properties.hubbardUValue": {
                default: defaultHubbardConfig.hubbardUValue,
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

materialContextMixin(HubbardUContextProvider.prototype);
