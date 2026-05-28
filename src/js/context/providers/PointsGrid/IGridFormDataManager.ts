import PointsGridFormDataProvider from "./PointsGridFormDataProvider";

type Name = "igrid";

export default class IGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: Name = "igrid";

    readonly divisor: number = 0.2;
}
