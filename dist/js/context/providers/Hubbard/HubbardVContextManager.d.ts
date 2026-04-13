import type { HubbardVContextItemSchema, HubbardVContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";
type Schema = HubbardVContextItemSchema;
type Data = HubbardVContextProviderSchema;
export default class HubbardVContextManager extends HubbardContextProvider<Schema> {
    readonly name: "hubbard_v";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: HubbardExternalContext): HubbardVContextManager;
    readonly uiSchemaStyled: {
        readonly "ui:options": {
            readonly addable: true;
            readonly orderable: true;
            readonly removable: true;
        };
    };
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext);
    getDefaultData(): Data;
}
export {};
