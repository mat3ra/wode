"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniformKGridConvergence = void 0;
const parameter_1 = require("./parameter");
class UniformKGridConvergence extends parameter_1.ConvergenceParameter {
    get increment() {
        return `${this.name} + ${this._increment}`;
    }
    get unitContext() {
        return {
            kgrid: {
                dimensions: [`{{${this.name}}}`, `{{${this.name}}}`, `{{${this.name}}}`],
                shifts: [0, 0, 0],
            },
            isKgridEdited: true,
            isUsingJinjaVariables: true,
        };
    }
    get finalValue() {
        return `${this.name} + 0`;
    }
}
exports.UniformKGridConvergence = UniformKGridConvergence;
