import type { AssignmentUnitSchema } from "@mat3ra/esse/dist/js/types";
import type { ApplicationExternalContext } from "../mixins/ApplicationContextMixin";
import type { MaterialExternalContext } from "../mixins/MaterialContextMixin";
import type { MaterialsExternalContext } from "../mixins/MaterialsContextMixin";
import type { MaterialsSetExternalContext } from "../mixins/MaterialsSetContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import type { JinjaExternalContext } from "./base/JSONSchemaDataProvider";
import BoundaryConditionsFormDataManager from "./BoundaryConditionsFormDataManager";
import QENEBInputDataManager from "./by_application/espresso/QENEBInputDataManager";
import QEPWXInputDataManager, { type JobExternalContext, type MethodDataExternalContext, type WorkflowExternalContext } from "./by_application/espresso/QEPWXInputDataManager";
import NWChemInputDataManager from "./by_application/nwchem/NWChemInputDataManager";
import VASPInputDataManager from "./by_application/vasp/VASPInputDataManager";
import VASPNEBInputDataManager from "./by_application/vasp/VASPNEBInputDataManager";
import CollinearMagnetizationDataManager from "./CollinearMagnetizationDataManager";
import HubbardContextManagerLegacy from "./Hubbard/HubbardContextManagerLegacy";
import HubbardJContextManager from "./Hubbard/HubbardJContextManager";
import HubbardUContextManager from "./Hubbard/HubbardUContextManager";
import HubbardVContextManager from "./Hubbard/HubbardVContextManager";
import IonDynamicsDataManager from "./IonDynamicsDataManager";
import MLSettingsDataManager from "./MLSettingsDataManager";
import MLTrainTestSplitDataManager from "./MLTrainTestSplitDataManager";
import NEBFormDataManager from "./NEBFormDataManager";
import NonCollinearMagnetizationDataManager from "./NonCollinearMagnetizationDataManager";
import PlanewaveCutoffDataManager from "./PlanewaveCutoffDataManager";
import IGridFormDataManager from "./PointsGrid/IGridFormDataManager";
import KGridFormDataManager from "./PointsGrid/KGridFormDataManager";
import QGridFormDataManager from "./PointsGrid/QGridFormDataManager";
import ExplicitKPath2PIBAFormDataManager from "./PointsPath/ExplicitKPath2PIBAFormDataManager";
import ExplicitKPathFormDataManager from "./PointsPath/ExplicitKPathFormDataManager";
import IPathFormDataManager from "./PointsPath/IPathFormDataManager";
import KPathFormDataManager from "./PointsPath/KPathFormDataManager";
import QPathFormDataManager from "./PointsPath/QPathFormDataManager";
/**
 * Registry mapping provider names (as they appear in templates) to their classes.
 * This is the single source of truth for provider mappings.
 */
export declare const PROVIDER_REGISTRY: {
    readonly PlanewaveCutoffDataManager: typeof PlanewaveCutoffDataManager;
    readonly KGridFormDataManager: typeof KGridFormDataManager;
    readonly QGridFormDataManager: typeof QGridFormDataManager;
    readonly IGridFormDataManager: typeof IGridFormDataManager;
    readonly QPathFormDataManager: typeof QPathFormDataManager;
    readonly IPathFormDataManager: typeof IPathFormDataManager;
    readonly KPathFormDataManager: typeof KPathFormDataManager;
    readonly ExplicitKPathFormDataManager: typeof ExplicitKPathFormDataManager;
    readonly ExplicitKPath2PIBAFormDataManager: typeof ExplicitKPath2PIBAFormDataManager;
    readonly HubbardJContextManager: typeof HubbardJContextManager;
    readonly HubbardUContextManager: typeof HubbardUContextManager;
    readonly HubbardVContextManager: typeof HubbardVContextManager;
    readonly HubbardContextManagerLegacy: typeof HubbardContextManagerLegacy;
    readonly NEBFormDataManager: typeof NEBFormDataManager;
    readonly BoundaryConditionsFormDataManager: typeof BoundaryConditionsFormDataManager;
    readonly MLSettingsDataManager: typeof MLSettingsDataManager;
    readonly MLTrainTestSplitDataManager: typeof MLTrainTestSplitDataManager;
    readonly IonDynamicsContextProvider: typeof IonDynamicsDataManager;
    readonly CollinearMagnetizationDataManager: typeof CollinearMagnetizationDataManager;
    readonly NonCollinearMagnetizationDataManager: typeof NonCollinearMagnetizationDataManager;
    readonly QEPWXInputDataManager: typeof QEPWXInputDataManager;
    readonly QENEBInputDataManager: typeof QENEBInputDataManager;
    readonly VASPInputDataManager: typeof VASPInputDataManager;
    readonly VASPNEBInputDataManager: typeof VASPNEBInputDataManager;
    readonly NWChemInputDataManager: typeof NWChemInputDataManager;
};
export type AssignmentContext = Record<AssignmentUnitSchema["operand"], AssignmentUnitSchema["value"]>;
export type SubworkflowContext = {
    subworkflowContext: AssignmentContext;
};
export type ScopeGlobalExternalContext = {
    scopeGlobal?: Record<string, unknown>;
};
/**
 * External context type used by ExecutionUnitInput when creating providers.
 * This type is always expected to be present when providers are instantiated.
 */
export type ExternalContext = ApplicationExternalContext & WorkflowExternalContext & JobExternalContext & MaterialsExternalContext & MethodDataExternalContext & MaterialsSetExternalContext & MaterialExternalContext & JinjaExternalContext & SubworkflowContext & ScopeGlobalExternalContext;
/**
 * Type for provider names as they appear in templates.
 */
export type ProviderName = keyof typeof PROVIDER_REGISTRY;
/**
 * Union type of all context provider instances.
 * Derived from the registry for type safety.
 */
export type AnyContextProvider = InstanceType<(typeof PROVIDER_REGISTRY)[ProviderName]>;
/**
 * Factory function to create a context provider instance from its name.
 *
 * @param name - The provider name as it appears in templates
 * @param context - The unit context
 * @param externalContext - The external context (must match the ExternalContext type defined in this file)
 * @returns An instance of the requested context provider
 * @throws Error if the provider name is unknown
 */
export declare function createProvider(name: ProviderName, context: UnitContext, externalContext: ExternalContext): AnyContextProvider;
export { BoundaryConditionsFormDataManager, QENEBInputDataManager, QEPWXInputDataManager, NWChemInputDataManager, VASPInputDataManager, VASPNEBInputDataManager, CollinearMagnetizationDataManager, HubbardContextManagerLegacy, HubbardJContextManager, HubbardUContextManager, HubbardVContextManager, IonDynamicsDataManager, MLSettingsDataManager, MLTrainTestSplitDataManager, NEBFormDataManager, NonCollinearMagnetizationDataManager, PlanewaveCutoffDataManager, IGridFormDataManager, KGridFormDataManager, QGridFormDataManager, ExplicitKPath2PIBAFormDataManager, ExplicitKPathFormDataManager, IPathFormDataManager, KPathFormDataManager, QPathFormDataManager, };
