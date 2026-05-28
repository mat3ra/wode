export class UniformKGridConvergence extends ConvergenceParameter {
    get unitContext(): {
        kgrid: {
            dimensions: string[];
            shifts: number[];
        };
        isKgridEdited: boolean;
        isUsingJinjaVariables: boolean;
    };
}
import { ConvergenceParameter } from "./parameter";
