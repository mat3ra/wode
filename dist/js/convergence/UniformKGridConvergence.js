"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConvergenceParameter_1 = __importDefault(require("./ConvergenceParameter"));
class UniformKGridConvergence extends ConvergenceParameter_1.default {
    constructor({ initialValue, increment }) {
        super({ initialValue });
        this.name = "N_k";
        this.finalValue = `${this.name} + 0`;
        this.unitContext = {
            data: {
                dimensions: [`{{${this.name}}}`, `{{${this.name}}}`, `{{${this.name}}}`],
                shifts: [0, 0, 0],
            },
            isUsingJinjaVariables: true,
        };
        this.increment = `${this.name} + ${increment || ""}`;
    }
}
exports.default = UniformKGridConvergence;
