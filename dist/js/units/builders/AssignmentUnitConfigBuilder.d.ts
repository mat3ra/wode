export class AssignmentUnitConfigBuilder extends UnitConfigBuilder {
    constructor(name: any, variableName: any, variableValue: any, input?: any[], results?: any[]);
    _variableName: any;
    _variableValue: any;
    _input: any[];
    input(arr: any): this;
    variableName(str: any): this;
    variableValue(str: any): this;
    build(): {
        input: any[];
        operand: any;
        value: any;
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
