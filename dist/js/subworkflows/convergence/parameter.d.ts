export class ConvergenceParameter {
    constructor({ name, initialValue, increment }: {
        name: any;
        initialValue: any;
        increment: any;
    });
    name: any;
    _initialValue: any;
    _increment: any;
    /**
     * Getter for initial value as string.
     * Note: this will be used in assignment unit.
     * @return {string}
     */
    get initialValue(): string;
    /**
     * @summary Defines how to increment the parameter.
     * @return {string} - increment operation used in assignment unit
     */
    get increment(): string;
    /**
     * Defines content for updating the unit context
     * @return {Object}
     */
    get unitContext(): Object;
    /**
     * Defines value once convergence is reached (for 'exit' unit).
     * Note: This is used in assignment unit and most often the variable will be assigned to itself.
     * @return {string}
     */
    get finalValue(): string;
    /**
     * Create list of  variables to fetch from a unit.
     * Note: this is used for the `input` field for an assignment unit.
     * @param {string} flowchartId - flowchartId of unit containing context variables
     * @return {Object|{scope, name}}
     */
    useVariablesFromUnitContext(flowchartId: string): Object | {
        scope: any;
        name: any;
    };
}
