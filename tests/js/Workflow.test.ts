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

import { Subworkflow, Workflow } from "../../src/js";
import { UnitType } from "../../src/js/enums";
import type { WorkflowSchema } from "../../src/js/workflows/types";
import workflowHashes from "../fixtures/workflow_hashes.json";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

describe("Workflow", () => {
    describe("construction", () => {
        it("creates workflow from default config with name, subworkflows, units, and _id", () => {
            const config = structuredClone(Workflow.defaultConfig);
            const workflow = new Workflow(config);

            expect(workflow.name).to.equal(Workflow.defaultConfig.name);
            expect(workflow.toJSON().subworkflows).to.have.lengthOf(
                Workflow.defaultConfig.subworkflows.length,
            );
            expect(workflow.toJSON().units).to.have.lengthOf(Workflow.defaultConfig.units.length);
            expect(workflow._id).to.be.a("string");
            expect(workflow._id.length).to.be.above(0);
        });
    });

    describe("ID generation", () => {
        it("assigns different _id to two workflows from default config", () => {
            const w1 = new Workflow(structuredClone(Workflow.defaultConfig));
            const w2 = new Workflow(structuredClone(Workflow.defaultConfig));

            expect(w1._id).to.not.equal(w2._id);
        });
    });

    describe("fromSubworkflow", () => {
        it("creates workflow with one subworkflow and one unit matching subworkflow name", () => {
            const subworkflowConfig = structuredClone(Workflow.defaultConfig.subworkflows[0]);
            const subworkflow = new Subworkflow(subworkflowConfig);
            const workflow = Workflow.fromSubworkflow(subworkflow);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(1);
            expect(workflow.toJSON().units).to.have.lengthOf(1);
            expect(workflow.name).to.equal(subworkflow.name);
        });
    });

    describe("toJSON", () => {
        it("returns object with name, units, subworkflows, and workflows", () => {
            const config = structuredClone(Workflow.defaultConfig);
            const workflow = new Workflow(config);
            const json = workflow.toJSON();

            expect(json).to.have.property("name", workflow.name);
            expect(json).to.have.property("units").that.is.an("array");
            expect(json).to.have.property("subworkflows").that.is.an("array");
            expect(json).to.have.property("workflows").that.is.an("array");
        });
    });

    describe("getters", () => {
        it("exposes usedApplications, usedApplicationNames, properties, systemName, defaultDescription", () => {
            const config = structuredClone(Workflow.defaultConfig);
            const workflow = new Workflow(config);

            expect(workflow.usedApplications).to.be.an("array");
            expect(workflow.usedApplicationNames).to.be.an("array");
            expect(workflow.getProperties()).to.be.an("array");
            expect(workflow.getSystemName()).to.be.a("string");
            expect(workflow.getSystemName().length).to.be.above(0);
            expect(workflow.getDefaultDescription()).to.be.a("string");
            expect(workflow.getDefaultDescription().length).to.be.above(0);
        });
    });

    describe("addSubworkflow / removeSubworkflow", () => {
        it("adds subworkflows then removes one and updates counts", () => {
            const config = structuredClone(Workflow.defaultConfig);
            const defaultSub = config.subworkflows[0];
            const defaultUnit = config.units[0];
            config.subworkflows = [
                defaultSub,
                { ...defaultSub, _id: "second-sw-id", name: "Second Subworkflow" },
            ];
            config.units = [
                defaultUnit,
                {
                    ...defaultUnit,
                    _id: "second-sw-id",
                    flowchartId: "second-fc-id",
                    name: "Second Subworkflow",
                },
            ];
            const workflow = new Workflow(config);
            const secondSubworkflow = new Subworkflow(config.subworkflows[1]);
            const thirdSubworkflow = new Subworkflow({
                ...defaultSub,
                _id: "third-sw-id",
                name: "Third Subworkflow",
            });
            workflow.addSubworkflow(thirdSubworkflow);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(3);
            expect(workflow.toJSON().units).to.have.lengthOf(3);

            workflow.removeSubworkflow(secondSubworkflow.id);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(2);
            expect(workflow.toJSON().units).to.have.lengthOf(2);
        });
    });

    describe("addUnitType", () => {
        it("adds a subworkflow unit when called with UnitType.subworkflow", () => {
            const config = structuredClone(Workflow.defaultConfig);
            const workflow = new Workflow(config);
            const initialSubworkflows = workflow.toJSON().subworkflows.length;
            const initialUnits = workflow.toJSON().units.length;

            workflow.addUnitType(UnitType.subworkflow);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(initialSubworkflows + 1);
            expect(workflow.toJSON().units).to.have.lengthOf(initialUnits + 1);
        });
    });

    describe("toggleRelaxation", () => {
        before(() => {
            JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
            ApplicationRegistry.setDriver(new StandataDriver());
        });

        it("adds the standata relaxation subworkflow with a schema-complete application", () => {
            const workflow = new Workflow(structuredClone(Workflow.defaultConfig));

            expect(() => workflow.toggleRelaxation()).not.to.throw();

            const relaxation = workflow
                .toJSON()
                .subworkflows.find(
                    (subworkflow) => subworkflow.systemName === "espresso-variable-cell-relaxation",
                );

            if (!relaxation) {
                throw new Error("Expected relaxation subworkflow to be added");
            }

            expect(relaxation.application).to.include({
                build: "GNU",
                name: "espresso",
                shortName: "qe",
                summary: "Quantum ESPRESSO",
                version: "6.3",
            });
        });

        it("removes the added relaxation subworkflow on the next toggle", () => {
            const workflow = new Workflow(structuredClone(Workflow.defaultConfig));
            const initialSubworkflowCount = workflow.subworkflowInstances.length;
            const initialUnitCount = workflow.unitInstances.length;

            workflow.toggleRelaxation();

            expect(workflow.hasRelaxation).to.equal(true);
            expect(workflow.subworkflowInstances).to.have.lengthOf(initialSubworkflowCount + 1);
            expect(workflow.unitInstances).to.have.lengthOf(initialUnitCount + 1);

            workflow.toggleRelaxation();

            expect(workflow.hasRelaxation).to.equal(false);
            expect(workflow.subworkflowInstances).to.have.lengthOf(initialSubworkflowCount);
            expect(workflow.unitInstances).to.have.lengthOf(initialUnitCount);
        });
    });

    describe("render", () => {
        before(() => {
            // Context providers resolve JSON Schemas from ESSE at construction time.
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        });

        it("invokes each subworkflow render with spread context and workflowHasRelaxation", () => {
            ApplicationRegistry.setDriver(new StandataDriver());

            const workflows = new WorkflowStandata().getAll().map((standataJson) => {
                return new Workflow(standataJson as unknown as WorkflowSchema);
            });

            expect(
                workflows.length,
                "expected at least one standata workflow from getAll() to construct",
            ).to.be.above(0);

            const material = OrderedMaterial.createDefault();
            material.hash = material.calculateHash();
            const context: WorkflowRenderContext = {
                material,
                materials: [material, material, material],
                jobHasParent: false,
            };

            workflows.forEach((workflow) => {
                workflow.render(context);

                workflow.subworkflowInstances.forEach((subworkflow) => {
                    subworkflow.unitsInstances
                        .filter((unit) => unit.type === UnitType.execution)
                        .forEach((unit) => {
                            expect(unit.renderingContext).to.deep.include({ ...context });
                            expect(unit.renderingContext).to.have.property("methodData");
                            expect(unit.renderingContext).to.have.property("application");
                            expect(unit.renderingContext).to.have.property("subworkflowContext");
                            expect(unit.renderingContext).to.have.property(
                                "workflowHasRelaxation",
                                workflow.hasRelaxation,
                            );
                            expect(unit.context).to.be.deep.equal([]);
                        });
                });
            });
        });
    });

    describe("calculateHash", () => {
        before(() => {
            JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
            ApplicationRegistry.setDriver(new StandataDriver());
        });

        // Expected to fail until `toJSON()` / schema clean stops mutating live `_json` used by hashing.
        it("returns the same hash before and after toJSON (standata workflow)", () => {
            const standataWorkflows = new WorkflowStandata().getAll();
            expect(standataWorkflows.length).to.be.above(0);

            const workflow = new Workflow(standataWorkflows[0] as unknown as WorkflowSchema);
            const hashBefore = workflow.calculateHash();
            workflow.toJSON();
            const hashAfter = workflow.calculateHash();

            expect(hashAfter).to.equal(hashBefore);
        });
    });

    describe("Workflow hashing", () => {
        const fixtureFiles = ["band_gap"] as const;
        const bandGapWorkflowName = "Band Gap";

        before(() => {
            JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
            ApplicationRegistry.setDriver(new StandataDriver());
        });

        fixtureFiles.forEach((fixtureFile) => {
            it(`calculateHash matches stored hash for ${fixtureFile}`, function () {
                const standata = new WorkflowStandata();
                const workflows = standata.findEntitiesByTags(
                    "espresso",
                    fixtureFile,
                ) as unknown as WorkflowSchema[];
                const workflow = workflows.find((w) => w.name === bandGapWorkflowName);
                if (!workflow) {
                    throw new Error(`Workflow ${bandGapWorkflowName} not found`);
                }
                const wf = new Workflow(workflow);
                const expectedHash = workflowHashes.espresso[fixtureFile].hash;
                if (!expectedHash) {
                    // eslint-disable-next-line no-console
                    console.log(`Hash for espresso/${fixtureFile}: ${wf.calculateHash()}`);
                    this.skip();
                }
                expect(wf.calculateHash()).to.equal(expectedHash);
            });
        });
    });
});
