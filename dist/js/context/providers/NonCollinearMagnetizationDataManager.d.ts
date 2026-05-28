import type { NonCollinearMagnetizationContextItemSchema, NonCollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Data = NonCollinearMagnetizationContextProviderSchema;
type Schema = NonCollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
interface NonCollinearMagnetizationDataManager extends MaterialContextMixin {
}
declare class NonCollinearMagnetizationDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
    readonly name: "nonCollinearMagnetization";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): NonCollinearMagnetizationDataManager;
    readonly isStartingMagnetization: boolean;
    readonly isConstrainedMagnetization: boolean;
    readonly isExistingChargeDensity: boolean;
    readonly isArbitrarySpinDirection: boolean;
    readonly isFixedMagnetization: boolean;
    readonly constrainedMagnetization: Data["constrainedMagnetization"];
    readonly jsonSchema: JSONSchema7;
    private readonly uniqueElementsWithLabels;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Data;
    get uiSchemaStyled(): {
        isExistingChargeDensity: {};
        lforcet: {
            "ui:readonly": boolean;
            "ui:widget": string;
            "ui:options": {
                inline: boolean;
            };
        };
        isArbitrarySpinDirection: {};
        spinAngles: {
            items: {
                atomicSpecies: {
                    "ui:readonly": boolean;
                };
            };
            "ui:readonly": boolean;
            "ui:options": {
                addable: boolean;
                orderable: boolean;
                removable: boolean;
            };
        };
        isStartingMagnetization: {};
        startingMagnetization: {
            items: {
                atomicSpecies: {
                    "ui:readonly": boolean;
                };
                value: {
                    "ui:classNames": string;
                };
            };
            "ui:readonly": boolean;
            "ui:options": {
                addable: boolean;
                orderable: boolean;
                removable: boolean;
            };
        };
        isConstrainedMagnetization: {};
        constrainedMagnetization: {
            "ui:readonly": boolean;
        };
        isFixedMagnetization: {
            "ui:readonly": boolean;
        };
        fixedMagnetization: {
            "ui:readonly": boolean;
        };
    };
}
export default NonCollinearMagnetizationDataManager;
