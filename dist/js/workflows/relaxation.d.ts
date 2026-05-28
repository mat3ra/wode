export function RelaxationLogicMixin(superclass: any): {
    new (): {
        [x: string]: any;
        get relaxationSubworkflow(): any;
        isRelaxationSubworkflow(subworkflow: any): boolean;
        get hasRelaxation(): any;
        toggleRelaxation(): void;
    };
    [x: string]: any;
};
