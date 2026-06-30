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

import { Workflow } from "../../src/js";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

/**
 * Verifies that context providers (e.g. QEPWXInputDataManager) correctly handle
 * labeled elements (e.g. Si1, Si2) by stripping labels before looking up
 * PERIODIC_TABLE for atomic mass.
 */
describe("Workflow render with labeled elements", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
        ApplicationRegistry.setDriver(new StandataDriver());
    });

    it("renders all Standata workflows with labeled material", () => {
        const standataWorkflows = new WorkflowStandata().getAll() as unknown as WorkflowSchema[];

        const material = OrderedMaterial.createDefault();
        material.setBasis({
            ...material.Basis.toJSON(),
            labels: [
                { id: 0, value: 1 },
                { id: 1, value: 2 },
            ],
        });
        material.hash = material.calculateHash();

        const context: WorkflowRenderContext = {
            material,
            materials: [material, material, material],
            jobHasParent: false,
        };

        // eslint-disable-next-line no-restricted-syntax
        for (const standataJson of standataWorkflows) {
            expect(
                () => new Workflow(standataJson).render(context),
                `workflow "${standataJson.name}" should render with labeled material`,
            ).to.not.throw();
        }
    });
});
