import {
    type InMemoryEntityInSet,
    inMemoryEntityInSetMixin,
} from "@mat3ra/code/dist/js/entity/set/InMemoryEntityInSetMixin";
import {
    type OrderedInMemoryEntityInSet,
    orderedEntityInSetMixin,
} from "@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { PointsGridDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import { Material } from "@mat3ra/made";
import { ApplicationRegistry, WorkflowStandata } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import { ExecutionUnit, Workflow } from "../../src/js";
import KGridFormDataManager from "../../src/js/context/providers/PointsGrid/KGridFormDataManager";
import { globalSettings } from "../../src/js/context/providers/settings";
import type { WorkflowRenderContext } from "../../src/js/Workflow";
import type { WorkflowSchema } from "../../src/js/workflows/types";
import { assertNotNull } from "./assertNotNull";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

function createWorkflowRenderContext(): WorkflowRenderContext {
    const material = OrderedMaterial.createDefault();
    material.hash = material.calculateHash();

    return {
        material,
        materials: [material],
        jobHasParent: false,
    };
}

/** A material whose reciprocal lattice is anisotropic, so its default k-grid differs by axis
 * (unlike the default material's isotropic [2,2,2]) — needed to prove a default grid is
 * recomputed per material rather than pinned to whichever material was rendered first. */
function createAnisotropicMaterial(): OrderedMaterial {
    const config = OrderedMaterial.createDefault().toJSON();

    delete config.lattice.vectors;
    config.lattice.type = "TRI";
    config.lattice.b *= 8;

    return new OrderedMaterial(config);
}

function createKgridProvider(
    dimensions: [number, number, number] | [string, string, string] = [
        "{{N_k}}",
        "{{N_k}}",
        "{{N_k}}",
    ],
) {
    const context = createWorkflowRenderContext();

    const provider = new KGridFormDataManager(
        {
            name: "kgrid",
            isEdited: true,
            data: {
                dimensions,
                shifts: [0, 0, 0],
                reciprocalVectorRatios: [1, 1, 1],
                gridMetricType: "KPPRA",
                gridMetricValue: 0,
                preferGridMetric: false,
            },
        },
        context,
    );

    return { provider, context };
}

function findTotalEnergyWorkflowConfig(): WorkflowSchema {
    const standataWorkflows = new WorkflowStandata().getAll() as unknown as WorkflowSchema[];
    const config = standataWorkflows.find((workflow) => workflow.name === "Total Energy");

    if (!config) {
        throw new Error("expected standata Total Energy workflow");
    }

    return config;
}

function setupTotalEnergyWithConvergence(context: WorkflowRenderContext) {
    const workflow = new Workflow(structuredClone(findTotalEnergyWorkflowConfig()));
    const subworkflow = assertNotNull(workflow.subworkflowInstances[0]);

    const executionUnit = subworkflow.unitsInstances.find(
        (unit): unit is ExecutionUnit => unit instanceof ExecutionUnit && unit.name === "pw_scf",
    );

    if (!executionUnit) {
        throw new Error("expected pw_scf execution unit on Total Energy subworkflow");
    }

    subworkflow.addConvergence({
        parameter: "N_k",
        parameterInitial: 1,
        parameterIncrement: 1,
        result: executionUnit.resultNames[0],
        resultInitial: 0,
        condition: "abs((prev_result-total_energy)/total_energy)",
        operator: "<",
        tolerance: 0.001,
        maxOccurrences: 10,
        externalContext: {
            ...context,
            workflowHasRelaxation: workflow.hasRelaxation,
        },
    });

    return { workflow, subworkflow, executionUnit };
}

function getKgridContextData(
    executionUnit: ExecutionUnit,
): PointsGridDataProviderSchema | undefined {
    const item = executionUnit.context.find((contextItem) => contextItem.name === "kgrid");

    return item?.data as PointsGridDataProviderSchema | undefined;
}

describe("renderContext", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    describe("KGridFormDataManager", () => {
        it("resolves {{N_k}} dimensions from scope.global and recomputes KPPRA for Si (2 atoms)", () => {
            const cases = [
                [1, 2],
                [2, 16],
                [3, 54],
            ] as const;

            cases.forEach(([N_k, expectedKPPRA]) => {
                const { provider } = createKgridProvider();

                expect(provider.renderContext({ N_k })).to.equal(true);
                expect(provider.getData().dimensions).to.deep.equal([N_k, N_k, N_k]);
                expect(provider.getData().gridMetricValue).to.equal(expectedKPPRA);
            });
        });

        it("returns false when dimensions are already numeric", () => {
            const { provider } = createKgridProvider([3, 3, 3]);

            expect(provider.renderContext({ N_k: 99 })).to.equal(false);
            expect(provider.getData().dimensions).to.deep.equal([3, 3, 3]);
        });

        it("coerces numeric string dimensions to numbers", () => {
            const { provider } = createKgridProvider(["3", "3", "3"]);

            expect(provider.renderContext({})).to.equal(true);
            expect(provider.getData().dimensions).to.deep.equal([3, 3, 3]);
            expect(provider.getData().gridMetricValue).to.equal(54);
        });
    });

    describe("Subworkflow.render", () => {
        it("persists resolved kgrid on pw_scf after convergence templating", () => {
            const context = createWorkflowRenderContext();
            const { workflow, subworkflow, executionUnit } =
                setupTotalEnergyWithConvergence(context);

            expect(getKgridContextData(executionUnit)?.dimensions).to.deep.equal([
                "{{N_k}}",
                "{{N_k}}",
                "{{N_k}}",
            ]);

            subworkflow.render({
                ...context,
                workflowHasRelaxation: workflow.hasRelaxation,
                scopeGlobal: { N_k: 3 },
            });

            expect(getKgridContextData(executionUnit)?.dimensions).to.deep.equal([3, 3, 3]);
            expect(getKgridContextData(executionUnit)?.gridMetricValue).to.equal(54);
        });
    });

    describe("Workflow.render", () => {
        it("resolves scope.global on subworkflow execution units", () => {
            const context = createWorkflowRenderContext();
            const { workflow, executionUnit } = setupTotalEnergyWithConvergence(context);

            workflow.render({ ...context, scopeGlobal: { N_k: 2 } });

            expect(getKgridContextData(executionUnit)?.dimensions).to.deep.equal([2, 2, 2]);
            expect(getKgridContextData(executionUnit)?.gridMetricValue).to.equal(16);
        });

        it("persists the resolved default kgrid on pw_scf with no explicit k-grid", () => {
            const context = createWorkflowRenderContext();
            const workflow = new Workflow(structuredClone(findTotalEnergyWorkflowConfig()));
            const subworkflow = assertNotNull(workflow.subworkflowInstances[0]);
            const executionUnit = subworkflow.unitsInstances.find(
                (unit): unit is ExecutionUnit =>
                    unit instanceof ExecutionUnit && unit.name === "pw_scf",
            );

            if (!executionUnit) {
                throw new Error("expected pw_scf execution unit on Total Energy subworkflow");
            }

            // No convergence added, no scopeGlobal passed: the default (unedited) path.
            workflow.render(context);

            const kgridData = getKgridContextData(executionUnit);

            expect(
                kgridData,
                "kgrid context item must be persisted on the default path",
            ).to.not.equal(undefined);
            // The default material is an isotropic 2-atom FCC cell, so its resolved default grid
            // is exactly [2, 2, 2] (KPPRA 5 / divisor 1, 2 atoms) — pin the real vector, not just
            // its shape, so a regression into calculateDimensions' unrecognised-metric branch
            // (which returns [1, 1, 1]) would fail this test.
            expect(kgridData?.dimensions).to.deep.equal([2, 2, 2]);
            // The persisted default must equal exactly what rendering already used (item 3): the
            // KPPRA-derived value, i.e. globalSettings.defaultKPPRA / divisor(kgrid) === defaultKPPRA / 1.
            expect(kgridData?.gridMetricValue).to.equal(globalSettings.defaultKPPRA);
            // The newly persisted item must satisfy the ESSE execution-unit schema, whose `context`
            // array validates each entry against `workflow/unit/context/item`.
            expect(() => executionUnit.validate()).to.not.throw();
        });

        it("recomputes the default kgrid per material instead of reusing a stale persisted default", () => {
            // Regression caught in review: `ExecutionUnit` seeds a provider from its own persisted
            // `context` regardless of `isEdited` (`getContextProvidersInstances` ->
            // `createProvider`). Without discarding unedited `data` on construction, material A's
            // persisted default would be read back as material B's input instead of recomputed.
            const materialA = OrderedMaterial.createDefault();
            materialA.hash = materialA.calculateHash();
            const materialB = createAnisotropicMaterial();
            const externalContext = { material: materialB, isUsingJinjaVariables: false };

            const persistedA = new KGridFormDataManager(
                { name: "kgrid" },
                { material: materialA, isUsingJinjaVariables: false },
            ).getContextItemData();

            const fedStaleDefault = new KGridFormDataManager(persistedA, externalContext).getData();
            const freshForB = new KGridFormDataManager(
                { name: "kgrid" },
                externalContext,
            ).getData();

            expect(fedStaleDefault.dimensions).to.deep.equal(freshForB.dimensions);
            expect(fedStaleDefault.reciprocalVectorRatios).to.deep.equal(
                freshForB.reciprocalVectorRatios,
            );
            // Material B's lattice is anisotropic (b scaled 8x), so this also confirms the
            // assertions above are not vacuously comparing two identical (isotropic) grids.
            expect(freshForB.dimensions).to.not.deep.equal([2, 2, 2]);
        });
    });
});
