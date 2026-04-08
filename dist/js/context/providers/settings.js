"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSettings = void 0;
class GlobalSettings {
    constructor() {
        this["PointsGridFormDataProvider.defaultKPPRA"] = 5;
        this.applicationsDriver = null;
    }
    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }
    setDefaultKPPRA(kppra) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }
    setupApplicationsDriver(driver) {
        this.applicationsDriver = driver;
    }
    getApplicationsDriver() {
        if (!this.applicationsDriver) {
            throw new Error("Wode Applications driver not set");
        }
        return this.applicationsDriver;
    }
}
exports.globalSettings = new GlobalSettings();
