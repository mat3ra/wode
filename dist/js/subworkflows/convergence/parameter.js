"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvergenceParameter = void 0;
/* eslint-disable class-methods-use-this */
const lodash_1 = __importDefault(require("lodash"));
class ConvergenceParameter {
    constructor({ name, initialValue, increment }) {
        this.name = name;
        this._initialValue = initialValue;
        this._increment = increment;
    }
    /**
     * Getter for initial value as string.
     * Note: this will be used in assignment unit.
     * @return {string}
     */
    get initialValue() {
        if (!lodash_1.default.isString(this._initialValue)) {
            return JSON.stringify(this._initialValue);
        }
        return this._initialValue;
    }
    /**
     * @summary Defines how to increment the parameter.
     * @return {string} - increment operation used in assignment unit
     */
    get increment() {
        return ""; // overwrite in derived class
    }
    /**
     * Defines content for updating the unit context
     * @return {Object}
     */
    get unitContext() {
        return {};
    }
    /**
     * Defines value once convergence is reached (for 'exit' unit).
     * Note: This is used in assignment unit and most often the variable will be assigned to itself.
     * @return {string}
     */
    get finalValue() {
        return `${this.name}`;
    }
    /**
     * Create list of  variables to fetch from a unit.
     * Note: this is used for the `input` field for an assignment unit.
     * @param {string} flowchartId - flowchartId of unit containing context variables
     * @return {Object|{scope, name}}
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    useVariablesFromUnitContext(flowchartId) {
        return [];
    }
}
exports.ConvergenceParameter = ConvergenceParameter;
