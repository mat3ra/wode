import PointsPathFormDataProvider from "./PointsPathFormDataProvider";

type Name = "explicitKPath";

export default class ExplicitKPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name = "explicitKPath";

    readonly useExplicitPath = true;
}
