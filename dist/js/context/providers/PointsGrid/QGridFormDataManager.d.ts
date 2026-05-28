import PointsGridFormDataProvider from "./PointsGridFormDataProvider";
type Name = "qgrid";
export default class QGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name: Name;
    readonly divisor: number;
}
export {};
