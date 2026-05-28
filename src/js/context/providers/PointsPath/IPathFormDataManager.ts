import PointsPathFormDataProvider from "./PointsPathFormDataProvider";

type Name = "ipath";

export default class IPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name = "ipath";
}
