import PointsPathFormDataProvider from "./PointsPathFormDataProvider";

type Name = "kpath";

export default class KPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name = "kpath";
}
