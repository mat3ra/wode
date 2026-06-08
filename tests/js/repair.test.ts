import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type {
    ErrorUnitSchema,
    ExecutionUnitSchema,
    SubworkflowSchema,
} from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry } from "@mat3ra/standata";
import StandataDriver from "@mat3ra/standata/dist/js/StandataDriver";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";
import type { AnySubworkflowUnitSchema } from "src/js/units/factory";

import { ExecutionUnit, Subworkflow, UnitFactory, Workflow } from "../../src/js";
import { UnitType } from "../../src/js/enums";

function invalidExecutionUnit(flowchartId: string) {
    return {
        type: UnitType.execution,
        name: "exec",
        flowchartId,
        results: [],
        preProcessors: [],
        postProcessors: [],
        monitors: [],
        input: [],
        context: [],
    };
}

describe("static repair", () => {
    let defaultApplication: ExecutionUnitSchema["application"];

    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    beforeEach(() => {
        ApplicationRegistry.setDriver(new StandataDriver());
        const app = new ApplicationRegistry().getDefaultApplication();
        if (!app) {
            throw new Error("ApplicationRegistry.getDefaultApplication() returned no application");
        }
        defaultApplication = app;
    });

    describe("ExecutionUnit.repair", () => {
        it("converts structurally invalid execution unit to error unit data", () => {
            const invalid = invalidExecutionUnit("fc-exec");

            const repaired = ExecutionUnit.repair(invalid as never);

            expect(repaired.type).to.equal(UnitType.error);
            expect((repaired as ErrorUnitSchema).originalUnit).to.deep.equal(invalid);
        });

        it("returns valid execution unit data unchanged", () => {
            const unit = UnitFactory.createDefaultSubworkflowUnit(
                "execution",
                defaultApplication,
            ).toJSON();

            const repaired = ExecutionUnit.repair(unit);

            expect(repaired).to.deep.equal(unit);
        });
    });

    describe("Subworkflow.repair", () => {
        it("repairs only invalid execution units", () => {
            const validUnit = UnitFactory.createDefaultSubworkflowUnit("assignment").toJSON();
            const invalidExecution = invalidExecutionUnit("fc-bad");

            const subworkflow = Subworkflow.defaultConfig;
            const subworkflowData: SubworkflowSchema = {
                ...subworkflow,
                units: [validUnit, invalidExecution as unknown as AnySubworkflowUnitSchema],
            };

            const result = Subworkflow.repair(subworkflowData);

            expect(result.units[0]).to.deep.equal(validUnit);
            expect(result.units[1].type).to.equal(UnitType.error);
        });
    });

    describe("Workflow.repair", () => {
        it("repairs invalid execution units in subworkflows and nested workflows", () => {
            const workflowConfig = structuredClone(Workflow.defaultConfig);
            const invalidExecution = invalidExecutionUnit("fc-nested");

            workflowConfig.subworkflows[0].units = [invalidExecution as never];

            const nestedSubworkflow = structuredClone(workflowConfig.subworkflows[0]);
            nestedSubworkflow._id = "nested-subworkflow-id";
            nestedSubworkflow.units = [invalidExecution as never];

            workflowConfig.workflows = [
                {
                    ...structuredClone(workflowConfig),
                    _id: "nested-workflow-id",
                    subworkflows: [nestedSubworkflow],
                    workflows: [],
                },
            ];

            const result = Workflow.repair(workflowConfig);

            expect(result.subworkflows[0].units[0].type).to.equal(UnitType.error);
            expect(result.workflows[0].subworkflows[0].units[0].type).to.equal(UnitType.error);
        });

        it("allows hydration after repair for converted execution units", () => {
            const workflowConfig = structuredClone(Workflow.defaultConfig);
            workflowConfig.subworkflows[0].units = [invalidExecutionUnit("fc-hydrate") as never];

            const document = Workflow.repair(workflowConfig);

            expect(() => new Workflow(document)).to.not.throw();
        });
    });
});
