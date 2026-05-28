"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConvergenceParameter = createConvergenceParameter;
const non_uniform_kgrid_1 = require("./non_uniform_kgrid");
const parameter_1 = require("./parameter");
const uniform_kgrid_1 = require("./uniform_kgrid");
function createConvergenceParameter({ name, initialValue, increment }) {
    switch (name) {
        case "N_k":
            return new uniform_kgrid_1.UniformKGridConvergence({ name, initialValue, increment });
        case "N_k_nonuniform":
            return new non_uniform_kgrid_1.NonUniformKGridConvergence({ name, initialValue, increment });
        default:
            return new parameter_1.ConvergenceParameter({ name, initialValue, increment });
    }
}
