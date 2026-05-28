import PointsPathFormDataProvider from "./PointsPathFormDataProvider";
type Name = "explicitKPath2PIBA";
export default class ExplicitKPath2PIBAFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name;
    readonly is2PIBA = true;
    readonly useExplicitPath = true;
}
export {};
