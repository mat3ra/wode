"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConvergenceParameter {
    constructor({ initialValue }) {
        this.initialValue =
            typeof initialValue === "string" ? initialValue : JSON.stringify(initialValue);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    useVariablesFromUnitContext(_flowchartId) {
        return [];
    }
}
exports.default = ConvergenceParameter;
