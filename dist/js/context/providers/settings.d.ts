import { Application } from "@mat3ra/ade";
import { Made } from "@mat3ra/made";
declare class GlobalSettings {
    "PointsGridFormDataProvider.defaultKPPRA": number;
    Material: typeof import("@mat3ra/made").Material;
    Application: typeof Application;
    constructor();
    get defaultKPPRA(): number;
    setApplication(application: typeof Application): void;
    setMaterial(material: typeof Made.Material): void;
    setDefaultKPPRA(kppra: number): void;
    resetDefaults(): void;
}
export declare const globalSettings: GlobalSettings;
export {};
