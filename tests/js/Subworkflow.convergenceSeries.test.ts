import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { JobSchema } from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import { AssignmentUnit, Subworkflow } from "../../src/js";
import { UnitTag } from "../../src/js/enums";

const CONVERGENCE_PARAM = "N_k";
const CONVERGENCE_RESULT = "total_energy";

function buildConvergenceSubworkflow({ withConvergence = true } = {}) {
    const units = withConvergence
        ? [
              new AssignmentUnit({
                  name: "set_kpoints",
                  flowchartId: "set-kpoints",
                  operand: CONVERGENCE_PARAM,
                  value: "12",
                  tags: [UnitTag.hasConvergenceParam],
              }).toJSON(),
              new AssignmentUnit({
                  name: "save_energy",
                  flowchartId: "save-energy",
                  operand: CONVERGENCE_RESULT,
                  value: "total_energy",
                  tags: [UnitTag.hasConvergenceResult],
              }).toJSON(),
          ]
        : [];
    return new Subworkflow({ ...Subworkflow.defaultConfig, units });
}

function makeScopeItem(
    global: Record<string, unknown>,
): NonNullable<JobSchema["scopeTrack"]>[number] {
    return { scope: { global, local: {} } };
}

describe("Subworkflow.convergenceSeries", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    it("returns [] when the subworkflow has no convergence units", () => {
        const subworkflow = buildConvergenceSubworkflow({ withConvergence: false });
        const scopeTrack = [makeScopeItem({ [CONVERGENCE_PARAM]: 12, [CONVERGENCE_RESULT]: -100 })];

        expect(subworkflow.convergenceSeries(scopeTrack)).to.deep.equal([]);
    });

    it("returns [] for empty/undefined scopeTrack", () => {
        const subworkflow = buildConvergenceSubworkflow();

        expect(subworkflow.convergenceSeries([])).to.deep.equal([]);
        expect(subworkflow.convergenceSeries(undefined)).to.deep.equal([]);
    });

    it("reconstructs the full scope from per-repetition diffs (param carried over from earlier diff)", () => {
        const subworkflow = buildConvergenceSubworkflow();

        // Diff-only scopeTrack: each item carries only keys added/changed in that repetition.
        // The last item omits `total_energy` (unchanged) so the param must come from accumulation.
        const scopeTrack = [
            makeScopeItem({ [CONVERGENCE_PARAM]: 12, [CONVERGENCE_RESULT]: -100 }),
            makeScopeItem({ [CONVERGENCE_PARAM]: 24, [CONVERGENCE_RESULT]: -98 }),
            makeScopeItem({ [CONVERGENCE_PARAM]: 36 }),
        ];

        const series = subworkflow.convergenceSeries(scopeTrack);

        // Last repetition is dropped because the (accumulated) result did not change.
        expect(series).to.deep.equal([
            { x: 1, param: 12, y: -100 },
            { x: 2, param: 24, y: -98 },
        ]);
    });

    it("matches the diff-based output for legacy full-snapshot scopeTrack (back-compat)", () => {
        const subworkflow = buildConvergenceSubworkflow();

        // Legacy format: every item stores the full cumulative scope.
        const scopeTrack = [
            makeScopeItem({ [CONVERGENCE_PARAM]: 12, [CONVERGENCE_RESULT]: -100 }),
            makeScopeItem({ [CONVERGENCE_PARAM]: 24, [CONVERGENCE_RESULT]: -98 }),
            makeScopeItem({ [CONVERGENCE_PARAM]: 36, [CONVERGENCE_RESULT]: -98 }),
        ];

        const series = subworkflow.convergenceSeries(scopeTrack);

        expect(series).to.deep.equal([
            { x: 1, param: 12, y: -100 },
            { x: 2, param: 24, y: -98 },
        ]);
    });
});
