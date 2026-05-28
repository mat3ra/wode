export function ConvergenceMixin(superclass: any): {
    new (): {
        [x: string]: any;
        get convergenceParam(): any;
        get convergenceResult(): any;
        convergenceSeries(scopeTrack: any): any;
        addConvergence({ parameter, parameterInitial, parameterIncrement, result, resultInitial, condition, operator, tolerance, maxOccurrences, }: {
            parameter: any;
            parameterInitial: any;
            parameterIncrement: any;
            result: any;
            resultInitial: any;
            condition: any;
            operator: any;
            tolerance: any;
            maxOccurrences: any;
        }): void;
    };
    [x: string]: any;
};
