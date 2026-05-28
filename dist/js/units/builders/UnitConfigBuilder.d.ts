export class UnitConfigBuilder {
    static usePredefinedIds: boolean;
    static _stringArrayToNamedObject(array: any): any;
    constructor({ name, type, flowchartId, cache }: {
        name: any;
        type: any;
        flowchartId: any;
        cache?: never[] | undefined;
    });
    type: any;
    _name: any;
    _head: boolean;
    _results: any[];
    _monitors: any[];
    _preProcessors: any[];
    _postProcessors: any[];
    cache: any[];
    _flowchartId: any;
    name(str: any): this;
    head(bool: any): this;
    generateFlowChartId(seed: any, countInCache?: number): any;
    flowchartId(flowchartId: any): this;
    addPreProcessors(preProcessorNames: any): this;
    addPostProcessors(postProcessorNames: any): this;
    addResults(resultNames: any): this;
    addMonitors(monitorNames: any): this;
    build(): {
        type: any;
        name: any;
        head: boolean;
        results: any[];
        monitors: any[];
        flowchartId: any;
        preProcessors: any[];
        postProcessors: any[];
    };
}
