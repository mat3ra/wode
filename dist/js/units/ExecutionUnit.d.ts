import { Application, Executable, Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ExecutableSchema, ExecutionUnitSchemaBase, FlavorSchema } from "@mat3ra/esse/dist/js/types";
import { type ImportantSettingsProvider } from "../context/mixins/ImportantSettingsProviderMixin";
import type { ContextItem } from "../context/providers/base/ContextProvider";
import ExecutionUnitInput from "../ExecutionUnitInput";
import { type ExecutionUnitSchemaMixin } from "../generated/ExecutionUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";
type Schema = ExecutionUnitSchemaBase;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin> & Constructor<ImportantSettingsProvider>;
interface SetApplicationProps {
    application: Application;
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}
interface SetExecutableProps {
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}
export type ExecutionUnitSchema = Schema;
declare const ExecutionUnit_base: Base;
export declare class ExecutionUnit extends ExecutionUnit_base implements Schema {
    applicationInstance: Application;
    executableInstance: Executable;
    flavorInstance: Flavor;
    inputInstances: ExecutionUnitInput[];
    renderingContext: ContextItem[];
    constructor(config: Schema);
    setApplication({ application, executable, flavor }: SetApplicationProps): void;
    setExecutable({ executable, flavor }: SetExecutableProps): void;
    setFlavor(flavor?: Flavor | FlavorSchema): void;
    setDefaultInput(): void;
    get allContextProviders(): import("../context/providers/base/ContextProvider").default<string, object, object, object>[];
    get contextProviders(): import("../context/providers/base/ContextProvider").default<string, object, object, object>[];
    /** Update rendering context and persistent context
     * Note: this function is sometimes being called without passing a context!
     */
    render(context?: AnyObject): void;
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
export {};
