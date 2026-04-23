import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";
type Name = "igrid";
type Schema = GridContextItemSchema;
export default class IGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: "igrid";
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): IGridFormDataManager;
}
export {};
