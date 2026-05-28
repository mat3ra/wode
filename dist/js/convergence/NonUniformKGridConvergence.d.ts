import ConvergenceParameter, { type ConvergenceParameterConfig, type UnitContext } from "./ConvergenceParameter";
export default class NonUniformKGridConvergence extends ConvergenceParameter {
    readonly increment: string;
    readonly name: "N_k_nonuniform";
    readonly finalValue: "N_k_nonuniform";
    readonly unitContext: UnitContext;
    constructor({ initialValue, increment }: ConvergenceParameterConfig);
    useVariablesFromUnitContext(flowchartId: string): {
        scope: string;
        name: string;
    }[];
}
