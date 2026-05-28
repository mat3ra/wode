interface ConvergenceParameterProps {
    initialValue: number | [number, number, number];
}

export type ConvergenceParameterConfig = ConvergenceParameterProps & {
    increment?: string | number;
};

export type UnitContext = {
    data: {
        dimensions: [string, string, string];
        shifts: [0, 0, 0];
    };
    isUsingJinjaVariables: true;
};

export default abstract class ConvergenceParameter {
    abstract readonly name: "N_k" | "N_k_nonuniform";

    abstract readonly finalValue: string;

    abstract readonly increment: string;

    abstract readonly unitContext: UnitContext;

    readonly initialValue: string;

    constructor({ initialValue }: ConvergenceParameterProps) {
        this.initialValue =
            typeof initialValue === "string" ? initialValue : JSON.stringify(initialValue);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    useVariablesFromUnitContext(_flowchartId: string): { scope: string; name: string }[] {
        return [];
    }
}
