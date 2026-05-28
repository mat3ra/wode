import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import ConvergenceParameter from "../../../convergence/ConvergenceParameter";
import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";
type Name = "kgrid";
type Schema = GridContextItemSchema;
export default class KGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: "kgrid";
    readonly jsonSchema: JSONSchema7;
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): KGridFormDataManager;
    applyConvergenceParameter(parameter: ConvergenceParameter): void;
}
export {};
