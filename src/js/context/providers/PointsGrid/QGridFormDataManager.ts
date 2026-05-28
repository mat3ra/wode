import PointsGridFormDataProvider from "./PointsGridFormDataProvider";

type Name = "qgrid";

export default class QGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: Name = "qgrid";

    readonly divisor: number = 5;
}
