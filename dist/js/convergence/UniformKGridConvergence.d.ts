import ConvergenceParameter, { type ConvergenceParameterConfig, type UnitContext } from "./ConvergenceParameter";
export default class UniformKGridConvergence extends ConvergenceParameter {
    readonly increment: string;
    readonly name: "N_k";
    readonly finalValue: "N_k + 0";
    readonly unitContext: UnitContext;
    constructor({ initialValue, increment }: ConvergenceParameterConfig);
}
