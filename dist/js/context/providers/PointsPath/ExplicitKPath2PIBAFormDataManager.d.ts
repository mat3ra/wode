import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, { type PointsPathFormDataProviderExternalContext } from "./PointsPathFormDataProvider";
type Name = "explicitKPath2PIBA";
export default class ExplicitKPath2PIBAFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: "explicitKPath2PIBA";
    readonly is2PIBA = true;
    readonly useExplicitPath = true;
    static createFromUnitContext(unitContext: UnitContext, externalContext: PointsPathFormDataProviderExternalContext): ExplicitKPath2PIBAFormDataManager;
}
export {};
