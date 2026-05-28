// import type { ContextProviderNameEnum as ProviderName } from "@mat3ra/esse/dist/js/types";

// import type ContextProvider from "./providers/base/ContextProvider";
// import type { ContextItem } from "./providers/base/ContextProvider";
import BoundaryConditionsFormDataProvider from "./providers/BoundaryConditionsFormDataProvider";
import QENEBContextProvider from "./providers/by_application/espresso/QENEBContextProvider";
import QEPWXContextProvider from "./providers/by_application/espresso/QEPWXContextProvider";
import NWChemTotalEnergyContextProvider from "./providers/by_application/nwchem/NWChemTotalEnergyContextProvider";
import VASPContextProvider from "./providers/by_application/vasp/VASPContextProvider";
import VASPNEBContextProvider from "./providers/by_application/vasp/VASPNEBContextProvider";
import CollinearMagnetizationContextProvider from "./providers/CollinearMagnetizationContextProvider";
import HubbardContextProviderLegacy from "./providers/Hubbard/HubbardContextProviderLegacy";
import HubbardJContextProvider from "./providers/Hubbard/HubbardJContextProvider";
import HubbardUContextProvider from "./providers/Hubbard/HubbardUContextProvider";
import HubbardVContextProvider from "./providers/Hubbard/HubbardVContextProvider";
import IonDynamicsContextProvider from "./providers/IonDynamicsContextProvider";
import MLSettingsContextProvider from "./providers/MLSettingsContextProvider";
import MLTrainTestSplitContextProvider from "./providers/MLTrainTestSplitContextProvider";
import NEBFormDataProvider from "./providers/NEBFormDataProvider";
import NonCollinearMagnetizationContextProvider from "./providers/NonCollinearMagnetizationContextProvider";
import PlanewaveCutoffsContextProvider from "./providers/PlanewaveCutoffsContextProvider";
import IGridFormDataManager from "./providers/PointsGrid/IGridFormDataManager";
import KGridFormDataManager from "./providers/PointsGrid/KGridFormDataManager";
import QGridFormDataManager from "./providers/PointsGrid/QGridFormDataManager";
import ExplicitKPath2PIBAFormDataManager from "./providers/PointsPath/ExplicitKPath2PIBAFormDataManager";
import ExplicitKPathFormDataManager from "./providers/PointsPath/ExplicitKPathFormDataManager";
import IPathFormDataManager from "./providers/PointsPath/IPathFormDataManager";
import KPathFormDataManager from "./providers/PointsPath/KPathFormDataManager";
import QPathFormDataManager from "./providers/PointsPath/QPathFormDataManager";

// const CONTEXT_DOMAINS = {
//     important: "important", // used to generate `ImportantSettings` form
// };

// export type ProvidersConfig = Record<
//     ProviderName,
//     new (
//         config: ContextItem,
//         domain?: string,
//         entityName?: "unit" | "subworkflow",
//     ) => ContextProvider
// >;

/** ********************************
 * Method-based context providers *
 ********************************* */

// export const wodeProviders = {
//     // NOTE: subworkflow-level data manager. Will override the unit-level data with the same name via subworkflow context.
//     PlanewaveCutoffDataManager: {
//         providerCls: PlanewaveCutoffsContextProvider,
//         config: _makeImportant({ name: "cutoffs", entityName: "subworkflow" }),
//     },
//     KGridFormDataManager: {
//         providerCls: PointsGridFormDataProvider,
//         config: _makeImportant({ name: "kgrid" }),
//     },
//     QGridFormDataManager: {
//         providerCls: PointsGridFormDataProvider,
//         config: _makeImportant({ name: "qgrid", divisor: 5 }), // Using less points for Qgrid by default
//     },
//     IGridFormDataManager: {
//         providerCls: PointsGridFormDataProvider,
//         config: _makeImportant({ name: "igrid", divisor: 0.2 }), // Using more points for interpolated grid by default
//     },
//     QPathFormDataManager: {
//         providerCls: PointsPathFormDataProvider,
//         config: _makeImportant({ name: "qpath" }),
//     },
//     IPathFormDataManager: {
//         providerCls: PointsPathFormDataProvider,
//         config: _makeImportant({ name: "ipath" }),
//     },
//     KPathFormDataManager: {
//         providerCls: PointsPathFormDataProvider,
//         config: _makeImportant({ name: "kpath" }),
//     },
//     ExplicitKPathFormDataManager: {
//         providerCls: ExplicitPointsPathFormDataProvider,
//         config: _makeImportant({ name: "explicitKPath" }),
//     },
//     ExplicitKPath2PIBAFormDataManager: {
//         providerCls: ExplicitPointsPath2PIBAFormDataProvider,
//         config: _makeImportant({ name: "explicitKPath2PIBA" }),
//     },
//     HubbardJContextManager: {
//         providerCls: HubbardJContextProvider,
//         config: _makeImportant({ name: "hubbard_j" }),
//     },
//     HubbardUContextManager: {
//         providerCls: HubbardUContextProvider,
//         config: _makeImportant({ name: "hubbard_u" }),
//     },
//     HubbardVContextManager: {
//         providerCls: HubbardVContextProvider,
//         config: _makeImportant({ name: "hubbard_v" }),
//     },
//     HubbardContextManagerLegacy: {
//         providerCls: HubbardContextProviderLegacy,
//         config: _makeImportant({ name: "hubbard_legacy" }),
//     },
//     // NEBFormDataManager context is stored under the same key (`input`) as InputDataManager contexts.
//     NEBFormDataManager: {
//         providerCls: NEBFormDataProvider,
//         config: _makeImportant({ name: "neb" }),
//     },
//     BoundaryConditionsFormDataManager: {
//         providerCls: BoundaryConditionsFormDataProvider,
//         config: _makeImportant({ name: "boundaryConditions" }),
//     },
//     MLSettingsDataManager: {
//         providerCls: MLSettingsContextProvider,
//         config: _makeImportant({ name: "mlSettings" }),
//     },
//     MLTrainTestSplitDataManager: {
//         providerCls: MLTrainTestSplitContextProvider,
//         config: _makeImportant({ name: "mlTrainTestSplit" }),
//     },
//     IonDynamicsContextProvider: {
//         providerCls: IonDynamicsContextProvider,
//         config: _makeImportant({ name: "dynamics" }),
//     },
//     CollinearMagnetizationDataManager: {
//         providerCls: CollinearMagnetizationContextProvider,
//         config: _makeImportant({ name: "collinearMagnetization" }),
//     },
//     NonCollinearMagnetizationDataManager: {
//         providerCls: NonCollinearMagnetizationContextProvider,
//         config: _makeImportant({ name: "nonCollinearMagnetization" }),
//     },
//     QEPWXInputDataManager: {
//         providerCls: QEPWXContextProvider,
//         config: { name: "input" },
//     },
//     QENEBInputDataManager: {
//         providerCls: QENEBContextProvider,
//         config: { name: "input" },
//     },
//     VASPInputDataManager: {
//         providerCls: VASPContextProvider,
//         config: { name: "input" },
//     },
//     VASPNEBInputDataManager: {
//         providerCls: VASPNEBContextProvider,
//         config: { name: "input" },
//     },
//     NWChemInputDataManager: {
//         providerCls: NWChemTotalEnergyContextProvider,
//         config: { name: "input" },
//     },
// };

export const newWodeProviders = {
    PlanewaveCutoffDataManager: PlanewaveCutoffsContextProvider,

    KGridFormDataManager,
    QGridFormDataManager,
    IGridFormDataManager,

    QPathFormDataManager,
    IPathFormDataManager,
    KPathFormDataManager,
    ExplicitKPathFormDataManager,
    ExplicitKPath2PIBAFormDataManager,

    HubbardJContextManager: HubbardJContextProvider,
    HubbardUContextManager: HubbardUContextProvider,
    HubbardVContextManager: HubbardVContextProvider,
    HubbardContextManagerLegacy: HubbardContextProviderLegacy,
    NEBFormDataManager: NEBFormDataProvider,
    BoundaryConditionsFormDataManager: BoundaryConditionsFormDataProvider,
    MLSettingsDataManager: MLSettingsContextProvider,
    MLTrainTestSplitDataManager: MLTrainTestSplitContextProvider,
    IonDynamicsContextProvider,
    CollinearMagnetizationDataManager: CollinearMagnetizationContextProvider,
    NonCollinearMagnetizationDataManager: NonCollinearMagnetizationContextProvider,

    QEPWXInputDataManager: QEPWXContextProvider,
    QENEBInputDataManager: QENEBContextProvider,
    VASPInputDataManager: VASPContextProvider,
    VASPNEBInputDataManager: VASPNEBContextProvider,
    NWChemInputDataManager: NWChemTotalEnergyContextProvider,
};
