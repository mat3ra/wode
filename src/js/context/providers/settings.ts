import { Application } from "@mat3ra/ade";
import { Made } from "@mat3ra/made";

class GlobalSettings {
    "PointsGridFormDataProvider.defaultKPPRA" = 5;

    Material = Made.Material;

    Application = Application;

    constructor() {
        this.resetDefaults();
    }

    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }

    setApplication(application: typeof Application) {
        this.Application = application;
    }

    setMaterial(material: typeof Made.Material) {
        this.Material = material;
    }

    setDefaultKPPRA(kppra: number) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }

    resetDefaults() {
        this.Material = Made.Material;
        this.Application = Application;
        this["PointsGridFormDataProvider.defaultKPPRA"] = 5;
    }
}

export const globalSettings = new GlobalSettings();
