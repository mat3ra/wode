import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { NonCollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Name = "nonCollinearMagnetization";
type Data = NonCollinearMagnetizationContextProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data> & Constructor<MaterialContextMixin>;
declare const NonCollinearMagnetizationContextProvider_base: Base;
export default class NonCollinearMagnetizationContextProvider extends NonCollinearMagnetizationContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly isStartingMagnetization: boolean;
    readonly isConstrainedMagnetization: boolean;
    readonly isExistingChargeDensity: boolean;
    readonly isArbitrarySpinDirection: boolean;
    readonly isFixedMagnetization: boolean;
    readonly constrainedMagnetization: Data["constrainedMagnetization"];
    readonly jsonSchema: JSONSchema7 | undefined;
    private readonly uniqueElementsWithLabels;
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext);
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
export {};
