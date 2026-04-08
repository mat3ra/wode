import type { ApplicationStandata } from "@mat3ra/standata";
type Instance = InstanceType<typeof ApplicationStandata>;
type ApplicationsDriver = {
    getExecutableAndFlavorByName: Instance["getExecutableAndFlavorByName"];
    getInput: Instance["getInput"];
};
declare class GlobalSettings {
    "PointsGridFormDataProvider.defaultKPPRA": number;
    get defaultKPPRA(): number;
    setDefaultKPPRA(kppra: number): void;
    private applicationsDriver;
    setupApplicationsDriver(driver: ApplicationsDriver): void;
    getApplicationsDriver(): ApplicationsDriver;
}
export declare const globalSettings: GlobalSettings;
export {};
