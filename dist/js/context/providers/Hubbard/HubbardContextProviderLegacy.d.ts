import type { HubbardLegacyContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { ContextItem, Domain } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";
type Name = "hubbard_legacy";
type Data = HubbardLegacyContextProviderSchema;
export default class HubbardContextProviderLegacy extends HubbardContextProvider<Name, Data> {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    readonly uiSchemaStyled: {
        "ui:options": {
            addable: boolean;
            orderable: boolean;
            removable: boolean;
        };
        items: {
            atomicSpeciesIndex: {
                "ui:readonly": boolean;
            };
        };
    };
    constructor(contextItem: ContextItem<Data>, externalContext: HubbardExternalContext);
    getDefaultData(): Data;
    setData(data: Data): void;
}
export {};
