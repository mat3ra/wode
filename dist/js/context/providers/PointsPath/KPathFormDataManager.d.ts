import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, { type PointsPathFormDataProviderExternalContext } from "./PointsPathFormDataProvider";
type Name = "kpath";
export default class KPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: "kpath";
    static createFromUnitContext(unitContext: UnitContext, externalContext: PointsPathFormDataProviderExternalContext): KPathFormDataManager;
}
export {};
