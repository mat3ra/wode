"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConvergenceParameterName = void 0;
var _schemas = _interopRequireDefault(require("@mat3ra/esse/dist/js/schemas.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const convergenceEnumOptionsSchema = _schemas.default.find(schema => schema.$id === "workflow/subworkflow/convergence/enum-options");
const values = convergenceEnumOptionsSchema?.definitions?.ConvergenceParameterNameEnum?.enum || [];
const ConvergenceParameterName = exports.ConvergenceParameterName = Object.freeze({
  N_k: values[0] || "N_k",
  N_k_nonuniform: values[1] || "N_k_nonuniform",
  N_k_nonuniform_2D: values[2] || "N_k_nonuniform_2D"
});