import type { CollinearMagnetizationContextItemSchema, CollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type MaterialContextMixin, type MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Data = CollinearMagnetizationContextProviderSchema;
type Schema = CollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
interface CollinearMagnetizationDataManager extends MaterialContextMixin {
}
declare class CollinearMagnetizationDataManager extends JSONSchemaDataProvider<Schema, ExternalContext> {
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
export default CollinearMagnetizationDataManager;
