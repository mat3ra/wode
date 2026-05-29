import ConvergenceParameter, {
    type ConvergenceParameterConfig,
    type UnitContext,
} from "./ConvergenceParameter";

export default class UniformKGridConvergence extends ConvergenceParameter {
    readonly increment: string;

    readonly name = "N_k" as const;

    readonly finalValue = `${this.name} + 0` as const;

    readonly unitContext: UnitContext = {
        data: {
            dimensions: [`{{${this.name}}}`, `{{${this.name}}}`, `{{${this.name}}}`],
            shifts: [0, 0, 0],
        },
        isUsingJinjaVariables: true,
    };

    constructor({ initialValue, increment }: ConvergenceParameterConfig) {
        super({ initialValue });

        this.increment = `${this.name} + ${increment || ""}`;
    }
}
