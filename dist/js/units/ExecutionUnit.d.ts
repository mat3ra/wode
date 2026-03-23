import { Application, Executable, Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ApplicationSchema, ExecutableSchema, ExecutionUnitSchema, FlavorSchema } from "@mat3ra/esse/dist/js/types";
import { type ExternalContext } from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import { type ExecutionUnitSchemaMixin } from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";
type Schema = ExecutionUnitSchema;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;
interface SetApplicationProps {
    application: Application | ApplicationSchema;
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}
type SetExecutableProps = Pick<SetApplicationProps, "executable" | "flavor">;
declare const ExecutionUnit_base: Base;
declare class ExecutionUnit extends ExecutionUnit_base implements Schema {
    applicationInstance: Application;
    executableInstance: Executable;
    flavorInstance: Flavor;
    inputInstances: ExecutionUnitInput[];
    renderingContext: Partial<ExternalContext>;
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    constructor(config: Schema);
    setApplication({ application, executable, flavor }: SetApplicationProps): void;
    setExecutable({ executable, flavor }: SetExecutableProps): void;
    setFlavor(flavor?: Flavor | FlavorSchema): void;
    setDefaultInput(): void;
    getContextProvidersInstances(externalContext: ExternalContext): import("../context/providers").AnyContextProvider[];
    addConvergenceContext(parameter: ConvergenceParameter, externalContext: ExternalContext): void;
    render(externalContext: ExternalContext): void;
    private saveContext;
    /**
     * @summary Calculates hash on unit-specific fields.
     * The meaningful fields of processing unit are operation, flavor and input at the moment.
     */
    getHashObject(): {
        application: {};
        executable: {};
        flavor: {} | undefined;
        input: string;
    };
}
export default ExecutionUnit;
