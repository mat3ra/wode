"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsGridFormDataProvider_1 = __importDefault(require("./PointsGridFormDataProvider"));
class IGridFormDataManager extends PointsGridFormDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext, 0.2);
        this.name = "igrid";
        this.jsonSchema = this.buildFormJsonSchema();
    }
    static createFromUnitContext(unitContext, externalContext) {
        const contextItem = this.findContextItem(unitContext, "igrid");
        return new IGridFormDataManager(contextItem, externalContext);
    }
}
exports.default = IGridFormDataManager;
