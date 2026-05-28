import PointsPathFormDataProvider from "./PointsPathFormDataProvider";
type Name = "explicitKPath";
export default class ExplicitKPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name;
    readonly useExplicitPath = true;
}
export {};
