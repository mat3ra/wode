"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKgridDataFromUnitContext = getKgridDataFromUnitContext;
exports.getEffectiveKgridPrecision = getEffectiveKgridPrecision;
const KGridFormDataManager_1 = __importDefault(require("./KGridFormDataManager"));
function getKgridDataFromUnitContext(context) {
    if (!context) {
        return undefined;
    }
    if (Array.isArray(context)) {
        const item = context.find((entry) => (entry === null || entry === void 0 ? void 0 : entry.name) === "kgrid");
        return item === null || item === void 0 ? void 0 : item.data;
    }
    if (typeof context === "object" && context !== null && "kgrid" in context) {
        return context.kgrid;
    }
    return undefined;
}
function getEffectiveKgridPrecision(kgridData, externalContext) {
    var _a, _b;
    const provider = new KGridFormDataManager_1.default({ name: "kgrid", data: kgridData }, externalContext);
    provider.setData(provider.getData());
    const normalized = provider.getData();
    return {
        value: (_a = normalized.gridMetricValue) !== null && _a !== void 0 ? _a : -1,
        metric: (_b = normalized.gridMetricType) !== null && _b !== void 0 ? _b : "KPPRA",
    };
}
