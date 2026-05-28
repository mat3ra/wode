"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsGridFormDataProvider_1 = __importDefault(require("./PointsGridFormDataProvider"));
class KGridFormDataManager extends PointsGridFormDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.name = "kgrid";
    }
}
exports.default = KGridFormDataManager;
