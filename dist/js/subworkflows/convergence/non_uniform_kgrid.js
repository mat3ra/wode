"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonUniformKGridConvergence = void 0;
const parameter_1 = require("./parameter");
class NonUniformKGridConvergence extends parameter_1.ConvergenceParameter {
    get increment() {
        return `[${this.initialValue}[i] + math.floor(iteration * ${this._increment} * float(context['kgrid']['reciprocalVectorRatios'][i])) for i in range(3)]`;
    }
    get unitContext() {
        return {
            kgrid: {
                dimensions: [`{{${this.name}[0]}}`, `{{${this.name}[1]}}`, `{{${this.name}[2]}}`],
                shifts: [0, 0, 0],
            },
            isKgridEdited: true,
            isUsingJinjaVariables: true,
        };
    }
    // eslint-disable-next-line class-methods-use-this
    useVariablesFromUnitContext(flowchartId) {
        return [
            {
                scope: flowchartId,
                name: "context",
            },
        ];
    }
}
exports.NonUniformKGridConvergence = NonUniformKGridConvergence;
