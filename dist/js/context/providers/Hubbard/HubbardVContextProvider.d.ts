import type { HubbardVContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { ContextItem } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";
type Name = "hubbard_v";
type Data = HubbardVContextProviderSchema;
export default class HubbardVContextProvider extends HubbardContextProvider<Name, Data> {
    readonly name: Name;
    readonly uiSchemaStyled: {
        "ui:options": {
            addable: boolean;
            orderable: boolean;
            removable: boolean;
        };
    };
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(contextItem: ContextItem<Data>, externalContext: HubbardExternalContext);
    getDefaultData(): Data;
}
export {};
