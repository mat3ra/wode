import ConvergenceParameter, {
    type ConvergenceParameterConfig,
    type UnitContext,
} from "./ConvergenceParameter";

export default class NonUniformKGridConvergence extends ConvergenceParameter {
    readonly increment: string;

    readonly name = "N_k_nonuniform" as const;

    readonly finalValue = "N_k_nonuniform" as const;

    readonly unitContext: UnitContext = {
        data: {
            dimensions: [`{{${this.name}[0]}}`, `{{${this.name}[1]}}`, `{{${this.name}[2]}}`],
            shifts: [0, 0, 0],
        },
        isUsingJinjaVariables: true,
    };

    constructor({ initialValue, increment }: ConvergenceParameterConfig) {
        super({ initialValue });

        this.increment = `[${this.initialValue}[i] + math.floor(iteration * ${
            increment || ""
        } * float(context['kgrid']['reciprocalVectorRatios'][i])) for i in range(3)]`;
    }

    // eslint-disable-next-line class-methods-use-this
    useVariablesFromUnitContext(flowchartId: string) {
        return [
            {
                scope: flowchartId,
                name: "context",
            },
        ];
    }
}
