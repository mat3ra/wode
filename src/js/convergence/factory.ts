import { type ConvergenceParameterConfig } from "./ConvergenceParameter";
import NonUniformKGridConvergence from "./NonUniformKGridConvergence";
import UniformKGridConvergence from "./UniformKGridConvergence";

type FactoryParams = ConvergenceParameterConfig & {
    name: "N_k" | "N_k_nonuniform";
};

export function createConvergenceParameter({ name, ...params }: FactoryParams) {
    switch (name) {
        case "N_k":
            return new UniformKGridConvergence(params);
        case "N_k_nonuniform":
            return new NonUniformKGridConvergence(params);
        default:
            throw new Error(`Invalid convergence parameter name: ${name}`);
    }
}
