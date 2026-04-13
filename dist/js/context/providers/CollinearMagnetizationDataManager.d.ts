import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { CollinearMagnetizationContextItemSchema, CollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Data = CollinearMagnetizationContextProviderSchema;
type Schema = CollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<MaterialContextMixin>;
declare const CollinearMagnetizationDataManager_base: Base;
export default class CollinearMagnetizationDataManager extends CollinearMagnetizationDataManager_base {
    readonly name: "collinearMagnetization";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): CollinearMagnetizationDataManager;
    readonly jsonSchema: JSONSchema7;
    private readonly isTotalMagnetization;
    private readonly firstElement;
    private readonly uniqueElementsWithLabels;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): Data;
    setData(data: Data): void;
    get uiSchemaStyled(): {
        startingMagnetization: {
            items: {
                atomicSpecies: {
                    "ui:classNames": string;
                };
                value: {
                    "ui:classNames": string;
                };
            };
            "ui:readonly": boolean;
        };
        isTotalMagnetization: {};
        totalMagnetization: {
            "ui:classNames": string;
            "ui:readonly": boolean;
        };
    };
}
export {};
