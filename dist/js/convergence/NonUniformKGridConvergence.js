"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConvergenceParameter_1 = __importDefault(require("./ConvergenceParameter"));
class NonUniformKGridConvergence extends ConvergenceParameter_1.default {
    constructor({ initialValue, increment }) {
        super({ initialValue });
        this.name = "N_k_nonuniform";
        this.finalValue = "N_k_nonuniform";
        this.unitContext = {
            data: {
                dimensions: [`{{${this.name}[0]}}`, `{{${this.name}[1]}}`, `{{${this.name}[2]}}`],
                shifts: [0, 0, 0],
            },
            isUsingJinjaVariables: true,
        };
        this.increment = `[${this.initialValue}[i] + math.floor(iteration * ${increment || ""} * float(context['kgrid']['reciprocalVectorRatios'][i])) for i in range(3)]`;
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
exports.default = NonUniformKGridConvergence;
