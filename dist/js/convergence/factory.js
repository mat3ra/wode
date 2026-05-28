"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConvergenceParameter = createConvergenceParameter;
const NonUniformKGridConvergence_1 = __importDefault(require("./NonUniformKGridConvergence"));
const UniformKGridConvergence_1 = __importDefault(require("./UniformKGridConvergence"));
function createConvergenceParameter({ name, ...params }) {
    switch (name) {
        case "N_k":
            return new UniformKGridConvergence_1.default(params);
        case "N_k_nonuniform":
            return new NonUniformKGridConvergence_1.default(params);
        default:
            throw new Error(`Invalid convergence parameter name: ${name}`);
    }
}
