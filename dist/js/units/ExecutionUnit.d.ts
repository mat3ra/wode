import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ExecutionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type AnyContextProvider, type ExternalContext } from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import { type ExecutionUnitSchemaMixin } from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";
type Schema = ExecutionUnitSchema;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;
export type ExecutionUnitConfig = Omit<Partial<Schema>, "application"> & SetApplicationProps;
type SetApplicationProps = Pick<Schema, "application"> & Pick<Partial<Schema>, "executable" | "flavor"> & SetExecutableProps;
type SetExecutableProps = {
    executableName?: string;
    flavorName?: string;
};
declare const ExecutionUnit_base: Base;
declare class ExecutionUnit extends ExecutionUnit_base implements Schema {
    inputInstances: ExecutionUnitInput[];
    renderingContext: Partial<ExternalContext>;
    contextProvidersInstances: AnyContextProvider[];
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    constructor(config: ExecutionUnitConfig);
    setApplication({ application, executable, flavor, executableName, flavorName, }: SetApplicationProps): void;
    setExecutable({ executableName, flavorName }: SetExecutableProps): void;
    setFlavor(flavorName?: string): void;
    /**
     * Persisted `input[].template` must match the current application/executable (and optional
     * applicationVersion). Otherwise the stored template is stale, and we take the default from
     * ApplicationRegistry.
     */
    private isPersistedInputItemCompatible;
    /**
     * Build `inputInstances` from the current flavor’s defaults (`ApplicationRegistry#getInput(application, flavor)`),
     * merged with persisted `this.input` from saved workflow JSON. For each input slot from the registry we
     * prefer a compatible persisted row matched by `template.name`, else by index; incompatible or missing
     * rows use the registry template. `render()` then serializes from these instances into `this.input`, so UI
     * and saved JSON stay aligned when Subworkflow re-serializes units after render.
     */
    setDefaultInput(): void;
    render(externalContext: ExternalContext, convergence?: ConvergenceParameter): void;
    private getContextProvidersInstances;
    savePersistentContext(): void;
    saveRenderingContext(externalContext: ExternalContext): void;
    saveContext(externalContext: ExternalContext): void;
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
            isDefaultVersion?: boolean;
            hasAdvancedComputeOptions?: boolean;
            isLicensed?: boolean;
            isUsingMaterial?: boolean;
            runConfig?: {
                commandTemplate: string;
                outFileName: string;
            };
        };
        executable: {
            _id?: string;
            slug?: string;
            systemName?: string;
            schemaVersion?: string;
            name: string;
            isDefault?: boolean;
            applicationName: string;
            applicationVersion: string;
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
                [k: string]: unknown;
            }[];
            postProcessors: {
                name: string;
                [k: string]: unknown;
            }[];
            monitors: {
                name: string;
                [k: string]: unknown;
            }[];
            results: {
                name: string;
                [k: string]: unknown;
            }[];
            executableName: string;
            applicationName: string;
            applicationVersion: string;
            input: {
                templateId?: string;
                templateName?: string;
                name: string;
            }[];
        };
        input: string;
    };
}
export default ExecutionUnit;
