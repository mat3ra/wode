"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointsPathFormDataProvider_1 = __importDefault(require("./PointsPathFormDataProvider"));
class ExplicitKPath2PIBAFormDataManager extends PointsPathFormDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.name = "explicitKPath2PIBA";
        this.is2PIBA = true;
        this.useExplicitPath = true;
    }
}
exports.default = ExplicitKPath2PIBAFormDataManager;
