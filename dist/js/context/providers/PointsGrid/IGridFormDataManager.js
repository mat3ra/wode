"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsGridFormDataProvider_1 = __importDefault(require("./PointsGridFormDataProvider"));
class IGridFormDataManager extends PointsGridFormDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.name = "igrid";
        this.divisor = 0.2;
    }
}
exports.default = IGridFormDataManager;
