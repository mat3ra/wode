import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";
type Name = "qgrid";
type Schema = GridContextItemSchema;
export default class QGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: "qgrid";
    readonly divisor: 5;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): QGridFormDataManager;
}
export {};
