import PointsPathFormDataProvider from "./PointsPathFormDataProvider";
type Name = "qpath";
export default class QPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name: Name;
}
export {};
