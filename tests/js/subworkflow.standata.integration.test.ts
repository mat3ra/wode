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

import { Workflow } from "../../src/js";
import { UnitType } from "../../src/js/enums";
import { AssignmentUnit, ConditionUnit } from "../../src/js/units";
import type { WorkflowRenderContext } from "../../src/js/Workflow";
import type { WorkflowSchema } from "../../src/js/workflows/types";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

describe("Subworkflow", () => {
    before(() => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    beforeEach(() => {
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    it("addConvergence on first subworkflow then workflow.render for every standata workflow (when applicable)", () => {
        const standataWorkflows = new WorkflowStandata().getAll() as unknown as WorkflowSchema[];
        expect(standataWorkflows.length).to.be.above(0);

        const workflows = standataWorkflows.map((standataJson) => {
            return new Workflow(structuredClone(standataJson));
        });

        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();
        const workflowRenderContext: WorkflowRenderContext = {
            material,
            materials: [material, material, material],
            jobHasParent: false,
        };

        let appliedCount = 0;
        const skipped: string[] = [];

        workflows.forEach((workflow, index) => {
            const firstSub = workflow.subworkflowInstances[0];
            if (!firstSub) {
                skipped.push(`[${index}] ${workflow.name}: no subworkflows`);
                return;
            }

            const executionForConvergence = firstSub.unitsInstances.find((u) => {
                return u.type === UnitType.execution && u.resultNames.length > 0;
            });
            if (!executionForConvergence) {
                skipped.push(
                    `[${index}] ${workflow.name}: first subworkflow has no execution unit with results`,
                );
                return;
            }

            const result = executionForConvergence.resultNames[0];
            firstSub.addConvergence({
                parameter: "N_k",
                parameterInitial: 1,
                parameterIncrement: 1,
                result,
                resultInitial: 0,
                condition: `abs((prev_result-${result})/${result})`,
                operator: "<",
                tolerance: 0.00001,
                maxOccurrences: 10,
                externalContext: {
                    ...workflowRenderContext,
                    workflowHasRelaxation: workflow.hasRelaxation,
                },
            });

            expect(firstSub.hasConvergence, workflow.name).to.equal(true);
            expect(firstSub.convergenceParam, workflow.name).to.equal("N_k");
            expect(firstSub.convergenceResult, workflow.name).to.equal(result);

            const convergenceConditions = firstSub.unitsInstances.filter(
                (u): u is ConditionUnit => {
                    return (
                        u.type === UnitType.condition &&
                        u.name === "check convergence" &&
                        u.statement.includes("prev_result")
                    );
                },
            );
            const conditionUnit = convergenceConditions[convergenceConditions.length - 1];
            expect(conditionUnit, workflow.name).to.not.equal(undefined);
            expect(conditionUnit?.statement, workflow.name).to.equal(
                `abs((prev_result-${result})/${result}) < 0.00001`,
            );

            const nextStep = firstSub.unitsInstances.find((u): u is AssignmentUnit => {
                return u.name === "update parameter";
            });
            expect(nextStep?.next, workflow.name).to.equal(executionForConvergence.flowchartId);

            workflow.render(workflowRenderContext);

            firstSub.unitsInstances
                .filter((unit) => unit.type === UnitType.execution)
                .forEach((unit) => {
                    expect(unit.renderingContext, workflow.name).to.deep.include({
                        ...workflowRenderContext,
                    });
                    expect(unit.renderingContext, workflow.name).to.have.property("methodData");
                    expect(unit.renderingContext, workflow.name).to.have.property("application");
                    expect(unit.renderingContext, workflow.name).to.have.property(
                        "subworkflowContext",
                    );
                    expect(unit.renderingContext, workflow.name).to.have.property(
                        "workflowHasRelaxation",
                        workflow.hasRelaxation,
                    );
                });

            appliedCount += 1;
        });

        expect(
            appliedCount,
            `expected at least one standata workflow where the first subworkflow supports convergence; skipped:\n${skipped.join(
                "\n",
            )}`,
        ).to.be.above(0);
    });
});
