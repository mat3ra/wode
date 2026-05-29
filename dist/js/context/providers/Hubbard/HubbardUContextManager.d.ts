import type { HubbardUContextItemSchema, HubbardUContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";
type Schema = HubbardUContextItemSchema;
type Data = HubbardUContextProviderSchema;
export default class HubbardUContextManager extends HubbardContextProvider<Schema> {
    readonly name: "hubbard_u";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: HubbardExternalContext): HubbardUContextManager;
    readonly uiSchemaStyled: {
        readonly "ui:options": {
            readonly addable: true;
            readonly orderable: false;
            readonly removable: true;
        };
    };
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext);
    getDefaultData(): Data;
}
export {};
