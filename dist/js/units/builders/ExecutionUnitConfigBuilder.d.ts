export class ExecutionUnitConfigBuilder extends UnitConfigBuilder {
    constructor(name: any, application: any, execName: any, flavorName: any, flowchartId: any, cache?: any[]);
    _results: any;
    _monitors: any;
    _preProcessors: any;
    _postProcessors: any;
    initialize(application: any, execName: any, flavorName: any): void;
    application: any;
    executable: any;
    flavor: any;
    build(): {
        application: any;
        executable: any;
        flavor: any;
        type: any;
        name: any;
        head: boolean;
        results: any[];
        monitors: any[];
        flowchartId: any;
        preProcessors: any[];
        postProcessors: any[];
    };
    /**
     * Creates an executable instance. This method is intended to be overridden in subclasses.
     * @param {Application} application - The application object
     * @param {string} execName - The name of the executable
     * @returns {Executable} The created executable instance
     */
    _createExecutable(application: Application, execName: string): Executable;
    /**
     * Creates a flavor instance. This method is intended to be overridden in subclasses.
     * @param {Executable} executable - The executable object
     * @param {string} flavorName - The name of the flavor
     * @returns {Flavor} The created flavor instance
     */
    _createFlavor(executable: Executable, flavorName: string): Flavor;
}
import { UnitConfigBuilder } from "./UnitConfigBuilder";
