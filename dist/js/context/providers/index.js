"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QPathFormDataManager = exports.KPathFormDataManager = exports.IPathFormDataManager = exports.ExplicitKPathFormDataManager = exports.ExplicitKPath2PIBAFormDataManager = exports.QGridFormDataManager = exports.KGridFormDataManager = exports.IGridFormDataManager = exports.PlanewaveCutoffDataManager = exports.NonCollinearMagnetizationDataManager = exports.NEBFormDataManager = exports.MLTrainTestSplitDataManager = exports.MLSettingsDataManager = exports.IonDynamicsDataManager = exports.HubbardVContextManager = exports.HubbardUContextManager = exports.HubbardJContextManager = exports.HubbardContextManagerLegacy = exports.CollinearMagnetizationDataManager = exports.VASPNEBInputDataManager = exports.VASPInputDataManager = exports.NWChemInputDataManager = exports.QEPWXInputDataManager = exports.QENEBInputDataManager = exports.BoundaryConditionsFormDataManager = exports.PROVIDER_REGISTRY = void 0;
exports.createProvider = createProvider;
const BoundaryConditionsFormDataManager_1 = __importDefault(require("./BoundaryConditionsFormDataManager"));
exports.BoundaryConditionsFormDataManager = BoundaryConditionsFormDataManager_1.default;
const QENEBInputDataManager_1 = __importDefault(require("./by_application/espresso/QENEBInputDataManager"));
exports.QENEBInputDataManager = QENEBInputDataManager_1.default;
const QEPWXInputDataManager_1 = __importDefault(require("./by_application/espresso/QEPWXInputDataManager"));
exports.QEPWXInputDataManager = QEPWXInputDataManager_1.default;
const NWChemInputDataManager_1 = __importDefault(require("./by_application/nwchem/NWChemInputDataManager"));
exports.NWChemInputDataManager = NWChemInputDataManager_1.default;
const VASPInputDataManager_1 = __importDefault(require("./by_application/vasp/VASPInputDataManager"));
exports.VASPInputDataManager = VASPInputDataManager_1.default;
const VASPNEBInputDataManager_1 = __importDefault(require("./by_application/vasp/VASPNEBInputDataManager"));
exports.VASPNEBInputDataManager = VASPNEBInputDataManager_1.default;
const CollinearMagnetizationDataManager_1 = __importDefault(require("./CollinearMagnetizationDataManager"));
exports.CollinearMagnetizationDataManager = CollinearMagnetizationDataManager_1.default;
const HubbardContextManagerLegacy_1 = __importDefault(require("./Hubbard/HubbardContextManagerLegacy"));
exports.HubbardContextManagerLegacy = HubbardContextManagerLegacy_1.default;
const HubbardJContextManager_1 = __importDefault(require("./Hubbard/HubbardJContextManager"));
exports.HubbardJContextManager = HubbardJContextManager_1.default;
const HubbardUContextManager_1 = __importDefault(require("./Hubbard/HubbardUContextManager"));
exports.HubbardUContextManager = HubbardUContextManager_1.default;
const HubbardVContextManager_1 = __importDefault(require("./Hubbard/HubbardVContextManager"));
exports.HubbardVContextManager = HubbardVContextManager_1.default;
const IonDynamicsDataManager_1 = __importDefault(require("./IonDynamicsDataManager"));
exports.IonDynamicsDataManager = IonDynamicsDataManager_1.default;
const MLSettingsDataManager_1 = __importDefault(require("./MLSettingsDataManager"));
exports.MLSettingsDataManager = MLSettingsDataManager_1.default;
const MLTrainTestSplitDataManager_1 = __importDefault(require("./MLTrainTestSplitDataManager"));
exports.MLTrainTestSplitDataManager = MLTrainTestSplitDataManager_1.default;
const NEBFormDataManager_1 = __importDefault(require("./NEBFormDataManager"));
exports.NEBFormDataManager = NEBFormDataManager_1.default;
const NonCollinearMagnetizationDataManager_1 = __importDefault(require("./NonCollinearMagnetizationDataManager"));
exports.NonCollinearMagnetizationDataManager = NonCollinearMagnetizationDataManager_1.default;
const PlanewaveCutoffDataManager_1 = __importDefault(require("./PlanewaveCutoffDataManager"));
exports.PlanewaveCutoffDataManager = PlanewaveCutoffDataManager_1.default;
const IGridFormDataManager_1 = __importDefault(require("./PointsGrid/IGridFormDataManager"));
exports.IGridFormDataManager = IGridFormDataManager_1.default;
const KGridFormDataManager_1 = __importDefault(require("./PointsGrid/KGridFormDataManager"));
exports.KGridFormDataManager = KGridFormDataManager_1.default;
const QGridFormDataManager_1 = __importDefault(require("./PointsGrid/QGridFormDataManager"));
exports.QGridFormDataManager = QGridFormDataManager_1.default;
const ExplicitKPath2PIBAFormDataManager_1 = __importDefault(require("./PointsPath/ExplicitKPath2PIBAFormDataManager"));
exports.ExplicitKPath2PIBAFormDataManager = ExplicitKPath2PIBAFormDataManager_1.default;
const ExplicitKPathFormDataManager_1 = __importDefault(require("./PointsPath/ExplicitKPathFormDataManager"));
exports.ExplicitKPathFormDataManager = ExplicitKPathFormDataManager_1.default;
const IPathFormDataManager_1 = __importDefault(require("./PointsPath/IPathFormDataManager"));
exports.IPathFormDataManager = IPathFormDataManager_1.default;
const KPathFormDataManager_1 = __importDefault(require("./PointsPath/KPathFormDataManager"));
exports.KPathFormDataManager = KPathFormDataManager_1.default;
const QPathFormDataManager_1 = __importDefault(require("./PointsPath/QPathFormDataManager"));
exports.QPathFormDataManager = QPathFormDataManager_1.default;
/**
 * Registry mapping provider names (as they appear in templates) to their classes.
 * This is the single source of truth for provider mappings.
 */
exports.PROVIDER_REGISTRY = {
    PlanewaveCutoffDataManager: PlanewaveCutoffDataManager_1.default,
    KGridFormDataManager: KGridFormDataManager_1.default,
    QGridFormDataManager: QGridFormDataManager_1.default,
    IGridFormDataManager: IGridFormDataManager_1.default,
    QPathFormDataManager: QPathFormDataManager_1.default,
    IPathFormDataManager: IPathFormDataManager_1.default,
    KPathFormDataManager: KPathFormDataManager_1.default,
    ExplicitKPathFormDataManager: ExplicitKPathFormDataManager_1.default,
    ExplicitKPath2PIBAFormDataManager: ExplicitKPath2PIBAFormDataManager_1.default,
    HubbardJContextManager: HubbardJContextManager_1.default,
    HubbardUContextManager: HubbardUContextManager_1.default,
    HubbardVContextManager: HubbardVContextManager_1.default,
    HubbardContextManagerLegacy: HubbardContextManagerLegacy_1.default,
    NEBFormDataManager: NEBFormDataManager_1.default,
    BoundaryConditionsFormDataManager: BoundaryConditionsFormDataManager_1.default,
    MLSettingsDataManager: MLSettingsDataManager_1.default,
    MLTrainTestSplitDataManager: MLTrainTestSplitDataManager_1.default,
    IonDynamicsContextProvider: IonDynamicsDataManager_1.default, // Note: name mismatch preserved from original
    CollinearMagnetizationDataManager: // Note: name mismatch preserved from original
    CollinearMagnetizationDataManager_1.default,
    NonCollinearMagnetizationDataManager: NonCollinearMagnetizationDataManager_1.default,
    QEPWXInputDataManager: QEPWXInputDataManager_1.default,
    QENEBInputDataManager: QENEBInputDataManager_1.default,
    VASPInputDataManager: VASPInputDataManager_1.default,
    VASPNEBInputDataManager: VASPNEBInputDataManager_1.default,
    NWChemInputDataManager: NWChemInputDataManager_1.default,
};
/**
 * Factory function to create a context provider instance from its name.
 *
 * @param name - The provider name as it appears in templates
 * @param context - The unit context
 * @param externalContext - The external context (must match the ExternalContext type defined in this file)
 * @returns An instance of the requested context provider
 * @throws Error if the provider name is unknown
 */
function createProvider(name, context, externalContext) {
    const ProviderClass = exports.PROVIDER_REGISTRY[name];
    if (!ProviderClass) {
        throw new Error(`Unknown provider: ${name}`);
    }
    // The full ExternalContext is a superset of each provider's expected context type,
    // so passing it to every provider's createFromUnitContext is type-safe (no assertion).
    return ProviderClass.createFromUnitContext(context, externalContext);
}
