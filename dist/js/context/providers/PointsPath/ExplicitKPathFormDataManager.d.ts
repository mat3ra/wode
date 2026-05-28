import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, { type PointsPathFormDataProviderExternalContext } from "./PointsPathFormDataProvider";
type Name = "explicitKPath";
export default class ExplicitKPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: "explicitKPath";
    readonly useExplicitPath = true;
    static createFromUnitContext(unitContext: UnitContext, externalContext: PointsPathFormDataProviderExternalContext): ExplicitKPathFormDataManager;
}
export {};
