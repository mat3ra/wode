"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsPathFormDataProvider_1 = __importDefault(require("./PointsPathFormDataProvider"));
class QPathFormDataManager extends PointsPathFormDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.name = "qpath";
    }
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "qpath");
        return new QPathFormDataManager(contextItem, externalContext);
    }
}
exports.default = QPathFormDataManager;
