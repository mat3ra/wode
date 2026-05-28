export class IOUnitConfigBuilder extends UnitConfigBuilder {
    constructor(name: any, endpointName: any, endpointOptions: any);
    _endpointName: any;
    _endpointOptions: any;
    _variableName: string;
    _subtype: string;
    _source: string;
    endpointName(str: any): this;
    endpointOptions(options: any): this;
    variableName(str: any): this;
    subtype(str: any): this;
    source(str: any): this;
    build(): {
        subtype: string;
        source: string;
        input: {
            endpoint: any;
            endpoint_options: any;
            name: string;
        }[];
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
import { UnitConfigBuilder } from "./UnitConfigBuilder";
