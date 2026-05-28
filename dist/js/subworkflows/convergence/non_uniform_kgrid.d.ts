export class NonUniformKGridConvergence extends ConvergenceParameter {
    get unitContext(): {
        kgrid: {
            dimensions: string[];
            shifts: number[];
        };
        isKgridEdited: boolean;
        isUsingJinjaVariables: boolean;
    };
    useVariablesFromUnitContext(flowchartId: any): {
        scope: any;
        name: string;
    }[];
}
import { ConvergenceParameter } from "./parameter";
