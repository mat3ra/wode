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
import { Material } from "@mat3ra/made";
import { ApplicationRegistry, WorkflowStandata } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";
import type { WorkflowRenderContext } from "src/js/Workflow";
import type { WorkflowSchema } from "src/js/workflows/types";

import { ExecutionUnit, Subworkflow, Workflow } from "../../src/js";
import { assertNotNull } from "./assertNotNull";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

const customKpath = [
    { point: "L", steps: 4 },
    { point: "Г", steps: 4 },
    { point: "X", steps: 4 },
    { point: "W", steps: 4 },
] as const;

function findVaspBandsUnit(workflow: Workflow): ExecutionUnit | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const sub of workflow.subworkflowInstances) {
        // eslint-disable-next-line no-restricted-syntax
        for (const unit of sub.unitsInstances) {
            if (unit instanceof ExecutionUnit && unit.name === "vasp_bands") {
                return unit;
            }
        }
    }
    return undefined;
}

function findBandStructureVaspJson(): WorkflowSchema {
    const standataWorkflows = new WorkflowStandata().getAll() as unknown as WorkflowSchema[];
    // eslint-disable-next-line no-restricted-syntax
    for (const workflow of standataWorkflows) {
        if (workflow.name === "Band Structure") {
            const probe = new Workflow(workflow);
            if (findVaspBandsUnit(probe)) {
                return workflow;
            }
        }
    }
    throw new Error("expected standata Band Structure (vasp) workflow");
}

function getKpointsCount(unit: ExecutionUnit): string {
    const kpoints = unit.input.find((input) => input.template.name === "KPOINTS");
    const rendered = kpoints?.rendered ?? "";
    return rendered.trim().split("\n")[1] ?? "";
}

describe("vasp_bands kpath Important settings", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    it("preserves edited kpath across repeated render() when material has no id", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        const context: WorkflowRenderContext = {
            material,
            materials: [material],
            jobHasParent: false,
        };

        const workflow = new Workflow(findBandStructureVaspJson());
        workflow.render(context);

        const unit = assertNotNull(findVaspBandsUnit(workflow));
        const provider = assertNotNull(
            unit.contextProvidersInstances.find((p) => p.name === "kpath"),
        );

        provider.setIsEdited(true);
        provider.setData([...customKpath]);
        unit.savePersistentContext();

        workflow.render(context);
        workflow.render(context);

        expect(unit.context.some((item) => item.name === "kpath" && item.isEdited)).to.equal(true);
        expect(getKpointsCount(unit)).to.equal("13");
    });

    it("clears isEdited when persisted materialHash differs from the current material", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        const context: WorkflowRenderContext = {
            material,
            materials: [material],
            jobHasParent: false,
        };

        const workflow = new Workflow(findBandStructureVaspJson());
        workflow.render(context);

        const unit = assertNotNull(findVaspBandsUnit(workflow));
        const provider = assertNotNull(
            unit.contextProvidersInstances.find((p) => p.name === "kpath"),
        );

        provider.setIsEdited(true);
        provider.setData([...customKpath]);
        unit.savePersistentContext();

        const otherMaterial = OrderedMaterial.createDefault();
        otherMaterial.hash = "different-material-hash";
        workflow.render({ ...context, material: otherMaterial, materials: [otherMaterial] });

        const kpathAfter = unit.context.find((item) => item.name === "kpath");
        expect(kpathAfter?.isEdited).not.to.equal(true);
    });

    it("renders 13 explicit k-points after custom L-4 Γ-4 X-4 W-4 path is persisted and re-rendered", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        const context: WorkflowRenderContext = {
            material,
            materials: [material],
            jobHasParent: false,
        };
        const subworkflowContext = { ...context, workflowHasRelaxation: false };

        const workflow = new Workflow(findBandStructureVaspJson());
        workflow.render(context);

        const unit = assertNotNull(findVaspBandsUnit(workflow));
        const provider = assertNotNull(
            unit.contextProvidersInstances.find((p) => p.name === "kpath"),
        );

        provider.setIsEdited(true);
        provider.setData([...customKpath]);
        unit.savePersistentContext();

        workflow.render(context);
        expect(getKpointsCount(unit)).to.equal("13");

        const subworkflow = workflow.subworkflowInstances[0];
        const roundTripped = new Subworkflow(subworkflow.toJSON());
        roundTripped.render(subworkflowContext);
        const roundTrippedUnit = assertNotNull(
            roundTripped.unitsInstances.find(
                (u): u is ExecutionUnit => u instanceof ExecutionUnit && u.name === "vasp_bands",
            ),
        );
        expect(
            roundTrippedUnit.context.some((item) => item.name === "kpath" && item.isEdited),
        ).to.equal(true);
        expect(getKpointsCount(roundTrippedUnit)).to.equal("13");
    });
});
