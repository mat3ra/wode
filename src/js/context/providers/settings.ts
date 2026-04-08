import type { ApplicationStandata } from "@mat3ra/standata";

type Instance = InstanceType<typeof ApplicationStandata>;

export interface ApplicationsDriver {
    getExecutableAndFlavorByName: Instance["getExecutableAndFlavorByName"];
    getInput: Instance["getInput"];
}

class GlobalSettings {
    "PointsGridFormDataProvider.defaultKPPRA" = 5;

    get defaultKPPRA() {
        return this["PointsGridFormDataProvider.defaultKPPRA"];
    }

    setDefaultKPPRA(kppra: number) {
        this["PointsGridFormDataProvider.defaultKPPRA"] = kppra;
    }

    private applicationsDriver: ApplicationsDriver | null = null;

    setupApplicationsDriver(driver: ApplicationsDriver) {
        this.applicationsDriver = driver;
    }

    getApplicationsDriver() {
        if (!this.applicationsDriver) {
            throw new Error("Wode Applications driver not set");
        }
        return this.applicationsDriver;
    }
}

export const globalSettings = new GlobalSettings();
