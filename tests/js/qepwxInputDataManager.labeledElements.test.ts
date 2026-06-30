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
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import QEPWXInputDataManager from "../../src/js/context/providers/by_application/espresso/QEPWXInputDataManager";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

/**
 * Verifies that QEPWXInputDataManager.buildQEPWXContext correctly handles
 * labeled elements (e.g. Si1, Si2) by stripping labels before looking up
 * PERIODIC_TABLE for atomic mass.
 */
describe("QEPWXInputDataManager with labeled elements", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    it("returns correct atomic mass for labeled elements", () => {
        const material = OrderedMaterial.createDefault();
        material.setBasis({
            ...material.Basis.toJSON(),
            labels: [
                { id: 0, value: 1 },
                { id: 1, value: 2 },
            ],
        });

        const provider = new QEPWXInputDataManager(
            {},
            { material, materials: [material], jobHasParent: false, workflowHasRelaxation: false },
        );
        const data = provider.getDefaultData();

        expect(data.ATOMIC_SPECIES_WITH_LABELS).to.have.lengthOf(2);
        expect(data.ATOMIC_SPECIES_WITH_LABELS[0].X).to.equal("Si1");
        expect(data.ATOMIC_SPECIES_WITH_LABELS[1].X).to.equal("Si2");
        expect(data.ATOMIC_SPECIES_WITH_LABELS[0].Mass_X).to.be.a("number").and.be.above(0);
        expect(data.ATOMIC_SPECIES_WITH_LABELS[1].Mass_X).to.be.a("number").and.be.above(0);
    });
});
