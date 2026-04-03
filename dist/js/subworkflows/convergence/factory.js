"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConvergenceParameter = createConvergenceParameter;
var _enums = require("./enums");
var _non_uniform_kgrid = require("./non_uniform_kgrid");
var _parameter = require("./parameter");
var _uniform_kgrid = require("./uniform_kgrid");
function createConvergenceParameter({
  name,
  initialValue,
  increment
}) {
  switch (name) {
    case _enums.ConvergenceParameterName.N_k:
      return new _uniform_kgrid.UniformKGridConvergence({
        name,
        initialValue,
        increment
      });
    case _enums.ConvergenceParameterName.N_k_nonuniform:
      return new _non_uniform_kgrid.NonUniformKGridConvergence({
        name,
        initialValue,
        increment
      });
    default:
      return new _parameter.ConvergenceParameter({
        name,
        initialValue,
        increment
      });
  }
}