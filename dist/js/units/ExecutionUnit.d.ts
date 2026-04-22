import { Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ExecutionUnitSchema, FlavorSchema } from "@mat3ra/esse/dist/js/types";
import { type AnyContextProvider, type ExternalContext } from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import { type ExecutionUnitSchemaMixin } from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";
type Schema = ExecutionUnitSchema;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;
export type ExecutionUnitConfig = Omit<Partial<Schema>, "executable" | "flavor" | "application"> & SetApplicationProps;
type SetApplicationProps = Pick<Schema, "application"> & SetExecutableProps;
type SetExecutableProps = Partial<Pick<Schema, "executable" | "flavor">>;
declare const ExecutionUnit_base: Base;
declare class ExecutionUnit extends ExecutionUnit_base implements Schema {
    inputInstances: ExecutionUnitInput[];
    renderingContext: Partial<ExternalContext>;
    contextProvidersInstances: AnyContextProvider[];
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ExecutionUnitConfig);
    setApplication({ application, executable, flavor }: SetApplicationProps): void;
    setExecutable({ executable, flavor }: SetExecutableProps): void;
    setFlavor(flavor?: Flavor | FlavorSchema): void;
    /**
     * Keep prior runtime items whose `name` still appears on the executable; otherwise fall back to
     * flavor defaults. `defaults` is cloned so later `toggle*` mutations never touch flavor arrays.
     */
    private static keepValidOrFallbackToDefaults;
    /**
     * Persisted `input[].template` must match the current application/executable (and optional
     * applicationVersion). Otherwise the stored template is stale, and we take the default from the driver.
     */
    private isPersistedInputItemCompatible;
    /**
     * Build `inputInstances` from the current flavor’s defaults (`getInput(this.flavor)`), merged with
     * persisted `this.input` from saved workflow JSON. For each driver slot we prefer a compatible
     * persisted row matched by `template.name`, else by index; incompatible or missing rows use the
     * driver template. `render()` then serializes from these instances into `this.input`, so UI and
     * saved JSON stay aligned when Subworkflow re-serializes units after render.
     */
    setDefaultInput(): void;
    render(externalContext: ExternalContext, convergence?: ConvergenceParameter): void;
    private getContextProvidersInstances;
    private saveContext;
    getHashObject(): {
        application: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            shortName: string;
            summary: string;
            version: string;
            build: string;
            hasAdvancedComputeOptions?: boolean;
            isLicensed?: boolean;
        };
        executable: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            applicationName: string;
            hasAdvancedComputeOptions?: boolean;
        };
        flavor: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            preProcessors: {
                name: string;
            }[];
            postProcessors: {
                name: string;
            }[];
            monitors: {
                name: string;
            }[];
            results: {
                name: string;
            }[];
            executableName?: string;
            applicationName?: string;
            input: {
                templateId?: string;
                templateName?: string;
                name?: string;
            }[];
            supportedApplicationVersions?: string[];
        };
        input: string;
    };
}
export default ExecutionUnit;
