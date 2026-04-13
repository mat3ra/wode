import type { HubbardLegacyContextItemSchema, HubbardLegacyContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import HubbardContextProvider, { type HubbardExternalContext } from "./HubbardContextProvider";
type Schema = HubbardLegacyContextItemSchema;
type Data = HubbardLegacyContextProviderSchema;
export default class HubbardContextManagerLegacy extends HubbardContextProvider<Schema> {
    readonly name: "hubbard_legacy";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: HubbardExternalContext): HubbardContextManagerLegacy;
    readonly jsonSchema: JSONSchema7;
    readonly uiSchemaStyled: {
        readonly "ui:options": {
            readonly addable: true;
            readonly orderable: false;
            readonly removable: true;
        };
        readonly items: {
            readonly atomicSpeciesIndex: {
                readonly "ui:readonly": true;
            };
        };
    };
    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext);
    getDefaultData(): Data;
    setData(data: Data): void;
}
export {};
