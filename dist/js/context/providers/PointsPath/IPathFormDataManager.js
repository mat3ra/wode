"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsPathFormDataProvider_1 = __importDefault(require("./PointsPathFormDataProvider"));
class IPathFormDataManager extends PointsPathFormDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.name = "ipath";
    }
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "ipath");
        return new IPathFormDataManager(contextItem, externalContext);
    }
}
exports.default = IPathFormDataManager;
