"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSettings = void 0;
class GlobalSettings {
    constructor() {
        this["PointsGridFormDataProvider.defaultKPPRA"] = 5;
    }
    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }
    setDefaultKPPRA(kppra) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }
}
exports.globalSettings = new GlobalSettings();
