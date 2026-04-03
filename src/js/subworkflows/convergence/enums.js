import schemas from "@mat3ra/esse/dist/js/schemas.json";

const convergenceEnumOptionsSchema = schemas.find(
    (schema) => schema.$id === "workflow/subworkflow/convergence/enum-options",
);
const values = convergenceEnumOptionsSchema?.definitions?.ConvergenceParameterNameEnum?.enum || [];

export const ConvergenceParameterName = Object.freeze({
    N_k: values[0] || "N_k",
    N_k_nonuniform: values[1] || "N_k_nonuniform",
    N_k_nonuniform_2D: values[2] || "N_k_nonuniform_2D",
});
