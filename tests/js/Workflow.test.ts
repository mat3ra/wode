import {
    type InMemoryEntityInSetConstructor,
    inMemoryEntityInSetMixin,
} from "@mat3ra/code/dist/js/entity/set/InMemoryEntityInSetMixin";
import {
    type OrderedInMemoryEntityInSet,
    type OrderedInMemoryEntityInSetConstructor,
    orderedEntityInSetMixin,
} from "@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin";
import type { WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import { Material } from "@mat3ra/made";
import { WorkflowStandata } from "@mat3ra/standata";
import { expect } from "chai";
import type { WorkflowRenderContext } from "src/js/Workflow";

import { Subworkflow, Workflow } from "../../src/js";
import { UnitType } from "../../src/js/enums";

type Base = typeof Material &
    InMemoryEntityInSetConstructor &
    OrderedInMemoryEntityInSetConstructor;

class OrderedMaterial extends (Material as Base) implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

describe("Workflow", () => {
    describe("construction", () => {
        it("creates workflow from default config with name, subworkflows, units, and _id", () => {
            const config = { ...Workflow.defaultConfig };
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
            const w1 = new Workflow({ ...Workflow.defaultConfig });
            const w2 = new Workflow({ ...Workflow.defaultConfig });

            expect(w1._id).to.not.equal(w2._id);
        });
    });

    describe("fromSubworkflow", () => {
        it("creates workflow with one subworkflow and one unit matching subworkflow name", () => {
            const subworkflowConfig = Workflow.defaultConfig.subworkflows[0];
            const subworkflow = new Subworkflow(subworkflowConfig);
            const workflow = Workflow.fromSubworkflow(subworkflow);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(1);
            expect(workflow.toJSON().units).to.have.lengthOf(1);
            expect(workflow.name).to.equal(subworkflow.name);
        });
    });

    describe("toJSON", () => {
        it("returns object with name, units, subworkflows, and workflows", () => {
            const config = { ...Workflow.defaultConfig };
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
            const config = { ...Workflow.defaultConfig };
            const workflow = new Workflow(config);

            expect(workflow.usedApplications).to.be.an("array");
            expect(workflow.usedApplicationNames).to.be.an("array");
            expect(workflow.properties).to.be.an("array");
            expect(workflow.systemName).to.be.a("string");
            expect(workflow.systemName.length).to.be.above(0);
            expect(workflow.defaultDescription).to.be.a("string");
            expect(workflow.defaultDescription.length).to.be.above(0);
        });
    });

    describe("addSubworkflow / removeSubworkflow", () => {
        it("adds subworkflows then removes one and updates counts", () => {
            const defaultSub = Workflow.defaultConfig.subworkflows[0];
            const defaultUnit = Workflow.defaultConfig.units[0];
            const config = {
                ...Workflow.defaultConfig,
                subworkflows: [
                    defaultSub,
                    { ...defaultSub, _id: "second-sw-id", name: "Second Subworkflow" },
                ],
                units: [
                    defaultUnit,
                    {
                        ...defaultUnit,
                        _id: "second-sw-id",
                        flowchartId: "second-fc-id",
                        name: "Second Subworkflow",
                    },
                ],
            };
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
            const config = { ...Workflow.defaultConfig };
            const workflow = new Workflow(config);
            const initialSubworkflows = workflow.toJSON().subworkflows.length;
            const initialUnits = workflow.toJSON().units.length;

            workflow.addUnitType(UnitType.subworkflow);

            expect(workflow.toJSON().subworkflows).to.have.lengthOf(initialSubworkflows + 1);
            expect(workflow.toJSON().units).to.have.lengthOf(initialUnits + 1);
        });
    });

    describe("render", () => {
        it("invokes each subworkflow render with spread context and parent workflow", () => {
            const standataWorkflows = new WorkflowStandata().getAll();
            expect(standataWorkflows.length).to.be.above(0);

            const workflows = standataWorkflows.map((standataJson) => {
                return new Workflow(standataJson as unknown as WorkflowSchema);
            });

            expect(
                workflows.length,
                "expected at least one standata workflow from getAll() to construct",
            ).to.be.above(0);

            const material = OrderedMaterial.createDefault();
            const context: WorkflowRenderContext = {
                material,
                materials: [material, material, material],
                job: {},
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
                            expect(unit.renderingContext).to.have.property("workflow");
                            expect(unit.context).to.be.deep.equal([]);
                        });
                });
            });
        });
    });

    describe("calculateHash", () => {
        it("returns a non-empty string", () => {
            const config = { ...Workflow.defaultConfig };
            const workflow = new Workflow(config);

            const hash = workflow.calculateHash();

            expect(hash).to.be.a("string");
            expect(hash.length).to.be.above(0);
        });

        it("returns the same hash for the same workflow", () => {
            const w1 = new Workflow({ ...Workflow.defaultConfig });
            const w2 = new Workflow({ ...Workflow.defaultConfig });

            expect(w1.calculateHash()).to.equal(w2.calculateHash());
        });

        it("returns different hash when workflow content differs", () => {
            const w1 = new Workflow({ ...Workflow.defaultConfig });
            const w2 = new Workflow({ ...Workflow.defaultConfig });
            w2.addUnitType(UnitType.subworkflow);

            expect(w1.calculateHash()).to.not.equal(w2.calculateHash());
        });
    });
});
