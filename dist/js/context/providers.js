"use strict";
// import type { ContextProviderNameEnum as ProviderName } from "@mat3ra/esse/dist/js/types";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newWodeProviders = void 0;
// import type ContextProvider from "./providers/base/ContextProvider";
// import type { ContextItem } from "./providers/base/ContextProvider";
const BoundaryConditionsFormDataProvider_1 = __importDefault(require("./providers/BoundaryConditionsFormDataProvider"));
const QENEBContextProvider_1 = __importDefault(require("./providers/by_application/espresso/QENEBContextProvider"));
const QEPWXContextProvider_1 = __importDefault(require("./providers/by_application/espresso/QEPWXContextProvider"));
const NWChemTotalEnergyContextProvider_1 = __importDefault(require("./providers/by_application/nwchem/NWChemTotalEnergyContextProvider"));
const VASPContextProvider_1 = __importDefault(require("./providers/by_application/vasp/VASPContextProvider"));
const VASPNEBContextProvider_1 = __importDefault(require("./providers/by_application/vasp/VASPNEBContextProvider"));
const CollinearMagnetizationContextProvider_1 = __importDefault(require("./providers/CollinearMagnetizationContextProvider"));
const HubbardContextProviderLegacy_1 = __importDefault(require("./providers/Hubbard/HubbardContextProviderLegacy"));
const HubbardJContextProvider_1 = __importDefault(require("./providers/Hubbard/HubbardJContextProvider"));
const HubbardUContextProvider_1 = __importDefault(require("./providers/Hubbard/HubbardUContextProvider"));
const HubbardVContextProvider_1 = __importDefault(require("./providers/Hubbard/HubbardVContextProvider"));
const IonDynamicsContextProvider_1 = __importDefault(require("./providers/IonDynamicsContextProvider"));
const MLSettingsContextProvider_1 = __importDefault(require("./providers/MLSettingsContextProvider"));
const MLTrainTestSplitContextProvider_1 = __importDefault(require("./providers/MLTrainTestSplitContextProvider"));
const NEBFormDataProvider_1 = __importDefault(require("./providers/NEBFormDataProvider"));
const NonCollinearMagnetizationContextProvider_1 = __importDefault(require("./providers/NonCollinearMagnetizationContextProvider"));
const PlanewaveCutoffsContextProvider_1 = __importDefault(require("./providers/PlanewaveCutoffsContextProvider"));
const IGridFormDataManager_1 = __importDefault(require("./providers/PointsGrid/IGridFormDataManager"));
const KGridFormDataManager_1 = __importDefault(require("./providers/PointsGrid/KGridFormDataManager"));
const QGridFormDataManager_1 = __importDefault(require("./providers/PointsGrid/QGridFormDataManager"));
const ExplicitKPath2PIBAFormDataManager_1 = __importDefault(require("./providers/PointsPath/ExplicitKPath2PIBAFormDataManager"));
const ExplicitKPathFormDataManager_1 = __importDefault(require("./providers/PointsPath/ExplicitKPathFormDataManager"));
const IPathFormDataManager_1 = __importDefault(require("./providers/PointsPath/IPathFormDataManager"));
const KPathFormDataManager_1 = __importDefault(require("./providers/PointsPath/KPathFormDataManager"));
const QPathFormDataManager_1 = __importDefault(require("./providers/PointsPath/QPathFormDataManager"));
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
exports.newWodeProviders = {
    PlanewaveCutoffDataManager: PlanewaveCutoffsContextProvider_1.default,
    KGridFormDataManager: KGridFormDataManager_1.default,
    QGridFormDataManager: QGridFormDataManager_1.default,
    IGridFormDataManager: IGridFormDataManager_1.default,
    QPathFormDataManager: QPathFormDataManager_1.default,
    IPathFormDataManager: IPathFormDataManager_1.default,
    KPathFormDataManager: KPathFormDataManager_1.default,
    ExplicitKPathFormDataManager: ExplicitKPathFormDataManager_1.default,
    ExplicitKPath2PIBAFormDataManager: ExplicitKPath2PIBAFormDataManager_1.default,
    HubbardJContextManager: HubbardJContextProvider_1.default,
    HubbardUContextManager: HubbardUContextProvider_1.default,
    HubbardVContextManager: HubbardVContextProvider_1.default,
    HubbardContextManagerLegacy: HubbardContextProviderLegacy_1.default,
    NEBFormDataManager: NEBFormDataProvider_1.default,
    BoundaryConditionsFormDataManager: BoundaryConditionsFormDataProvider_1.default,
    MLSettingsDataManager: MLSettingsContextProvider_1.default,
    MLTrainTestSplitDataManager: MLTrainTestSplitContextProvider_1.default,
    IonDynamicsContextProvider: IonDynamicsContextProvider_1.default,
    CollinearMagnetizationDataManager: CollinearMagnetizationContextProvider_1.default,
    NonCollinearMagnetizationDataManager: NonCollinearMagnetizationContextProvider_1.default,
    QEPWXInputDataManager: QEPWXContextProvider_1.default,
    QENEBInputDataManager: QENEBContextProvider_1.default,
    VASPInputDataManager: VASPContextProvider_1.default,
    VASPNEBInputDataManager: VASPNEBContextProvider_1.default,
    NWChemInputDataManager: NWChemTotalEnergyContextProvider_1.default,
};
