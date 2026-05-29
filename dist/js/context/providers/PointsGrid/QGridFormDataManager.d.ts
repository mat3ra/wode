import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";
type Name = "qgrid";
type Schema = GridContextItemSchema;
export default class QGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: "qgrid";
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): QGridFormDataManager;
}
export {};
