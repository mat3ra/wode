import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, { type PointsPathFormDataProviderExternalContext } from "./PointsPathFormDataProvider";
type Name = "ipath";
export default class IPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: "ipath";
    static createFromUnitContext(unitContext: UnitContext, externalContext: PointsPathFormDataProviderExternalContext): IPathFormDataManager;
}
export {};
