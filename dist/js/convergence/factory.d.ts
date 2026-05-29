import { type ConvergenceParameterConfig } from "./ConvergenceParameter";
import NonUniformKGridConvergence from "./NonUniformKGridConvergence";
import UniformKGridConvergence from "./UniformKGridConvergence";
type FactoryParams = ConvergenceParameterConfig & {
    name: "N_k" | "N_k_nonuniform";
};
export declare function createConvergenceParameter({ name, ...params }: FactoryParams): NonUniformKGridConvergence | UniformKGridConvergence;
export {};
