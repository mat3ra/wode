class GlobalSettings {
    "PointsGridFormDataProvider.defaultKPPRA" = 5;

    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }

    setDefaultKPPRA(kppra: number) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }
}

export const globalSettings = new GlobalSettings();
