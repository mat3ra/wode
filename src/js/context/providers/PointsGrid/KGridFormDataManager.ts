import PointsGridFormDataProvider from "./PointsGridFormDataProvider";

type Name = "kgrid";

export default class KGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: Name = "kgrid";
}
