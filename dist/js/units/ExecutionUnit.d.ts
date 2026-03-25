import { Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ExecutionUnitSchema, FlavorSchema } from "@mat3ra/esse/dist/js/types";
import { type ExternalContext } from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import { type ExecutionUnitSchemaMixin } from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";
type Schema = ExecutionUnitSchema;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;
type ExecutionUnitConfig = Omit<Schema, "executable" | "flavor"> & SetExecutableProps;
type SetApplicationProps = Pick<Schema, "application"> & SetExecutableProps;
type SetExecutableProps = Partial<Pick<Schema, "executable" | "flavor">>;
declare const ExecutionUnit_base: Base;
declare class ExecutionUnit extends ExecutionUnit_base implements Schema {
    inputInstances: ExecutionUnitInput[];
    renderingContext: Partial<ExternalContext>;
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    constructor(config: ExecutionUnitConfig);
    setApplication({ application, executable, flavor }: SetApplicationProps): void;
    setExecutable({ executable, flavor }: SetExecutableProps): void;
    setFlavor(flavor?: Flavor | FlavorSchema): void;
    setDefaultInput(): void;
    render(externalContext: ExternalContext): void;
    getContextProvidersInstances(externalContext: ExternalContext): import("../context/providers").AnyContextProvider[];
    addConvergenceContext(parameter: ConvergenceParameter, externalContext: ExternalContext): void;
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
            preProcessors: {
                name: string;
            }[];
            postProcessors: {
                name: string;
            }[];
            monitors: {
                name: string;
            }[];
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
