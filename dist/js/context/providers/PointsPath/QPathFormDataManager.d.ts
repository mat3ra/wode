import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, { type PointsPathFormDataProviderExternalContext } from "./PointsPathFormDataProvider";
type Name = "qpath";
export default class QPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: "qpath";
    static createFromUnitContext(unitContext: UnitContext, externalContext: PointsPathFormDataProviderExternalContext): QPathFormDataManager;
}
export {};
