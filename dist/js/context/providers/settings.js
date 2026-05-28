"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSettings = void 0;
const ade_1 = require("@mat3ra/ade");
const made_1 = require("@mat3ra/made");
class GlobalSettings {
    constructor() {
        this["PointsGridFormDataProvider.defaultKPPRA"] = 5;
        this.Material = made_1.Made.Material;
        this.Application = ade_1.Application;
        this.resetDefaults();
    }
    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }
    setApplication(application) {
        this.Application = application;
    }
    setMaterial(material) {
        this.Material = material;
    }
    setDefaultKPPRA(kppra) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }
    resetDefaults() {
        this.Material = made_1.Made.Material;
        this.Application = ade_1.Application;
        this["PointsGridFormDataProvider.defaultKPPRA"] = 5;
    }
}
exports.globalSettings = new GlobalSettings();
