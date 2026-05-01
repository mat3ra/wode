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
import type { WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import { Material } from "@mat3ra/made";
import { ApplicationRegistry, WorkflowStandata } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";
import type { WorkflowRenderContext } from "src/js/Workflow";

import { ExecutionUnit, Workflow } from "../../src/js";
import KGridFormDataManager from "../../src/js/context/providers/PointsGrid/KGridFormDataManager";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

/**
 * Reproduces job designer / Important settings: RJSForm mutates the *current*
 * `contextProvidersInstances`. The next `render()` replaces that array from `this.context`, so
 * edits must be copied into `this.context` first — e.g. via `savePersistentContext()` (same call
 * the web-app makes from Important settings before `onContextChanged` / `workflow.render()`).
 */
describe("ExecutionUnit contextProvidersInstances + render()", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    it("persists in-memory provider edits when render() runs again (Important settings path)", () => {
        const standataWorkflows = new WorkflowStandata().getAll();
        expect(standataWorkflows.length).to.be.above(0);

        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        // Enough entries for `input.perMaterial[MATERIAL_INDEX]` on multi-material standata
        // workflows (e.g. Valence Band Offset uses indices "0", "1", "2").
        const context: WorkflowRenderContext = {
            material,
            materials: [material, material, material],
            jobHasParent: false,
        };

        let workflow: Workflow | undefined;
        let executionUnit: ExecutionUnit | undefined;

        // eslint-disable-next-line no-restricted-syntax
        for (const standataJson of standataWorkflows) {
            const w = new Workflow(standataJson as unknown as WorkflowSchema);
            w.render(context);
            // eslint-disable-next-line no-restricted-syntax
            for (const sub of w.subworkflowInstances) {
                // eslint-disable-next-line no-restricted-syntax
                for (const unit of sub.unitsInstances) {
                    // eslint-disable-next-line no-continue
                    if (!(unit instanceof ExecutionUnit)) continue;
                    const hasBoundary = unit.contextProvidersInstances.some(
                        (p) => p.name === "boundaryConditions",
                    );
                    if (hasBoundary) {
                        workflow = w;
                        executionUnit = unit;
                        break;
                    }
                }
                if (executionUnit) break;
            }
            if (executionUnit) break;
        }

        expect(
            workflow,
            "expected a standata workflow with boundaryConditions on an execution unit",
        ).to.be.instanceOf(Workflow);
        expect(executionUnit).to.be.instanceOf(ExecutionUnit);

        const unit = executionUnit as ExecutionUnit;
        const provider = unit.contextProvidersInstances.find((p) => {
            return p.name === "boundaryConditions";
        });
        // eslint-disable-next-line no-unused-expressions
        expect(provider).to.be.ok;

        const distinctiveElectricField = 9.87654321;
        const priorData = provider!.getData();
        provider!.setIsEdited(true);
        provider!.setData({
            ...priorData,
            electricField: distinctiveElectricField,
        });
        unit.savePersistentContext();

        // Same workflow + same unit instances as the designer: persist then `onContextChanged` → `workflow.render()`.
        // Without `savePersistentContext()` before this, the next render rebuilds providers from stale
        // `this.context` and this assertion fails.
        workflow!.render(context);

        const persisted = unit.context.find((c) => c.name === "boundaryConditions");
        expect(persisted?.data).to.include({ electricField: distinctiveElectricField });
    });

    it("constructs KGridFormDataManager when persisted data uses spacing metric (init before setData)", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        const externalContext: WorkflowRenderContext = {
            material,
            materials: [material],
            jobHasParent: false,
        };

        expect(() => {
            return new KGridFormDataManager(
                {
                    name: "kgrid",
                    isEdited: true,
                    data: {
                        dimensions: [2, 2, 2],
                        shifts: [0, 0, 0],
                        reciprocalVectorRatios: [1, 1, 1],
                        gridMetricType: "spacing",
                        gridMetricValue: 0.5,
                        preferGridMetric: false,
                    },
                },
                externalContext,
            );
        }).to.not.throw();
    });
});
