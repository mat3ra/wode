export class AssertionUnitConfigBuilder extends UnitConfigBuilder {
    constructor(name: any, statement: any, errorMessage: any);
    _statement: any;
    _errorMessage: any;
    statement(str: any): this;
    errorMessage(str: any): this;
    build(): {
        statement: any;
        errorMessage: any;
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
