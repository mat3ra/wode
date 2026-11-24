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
 * pw.x looks for symmetry only about its Cartesian axes, so the cell is rendered in the
 * lattice type's standard orientation rather than in the generic one.
 */
describe("QEPWXInputDataManager cell parameters", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    it("renders the lattice vectors in the standard orientation", () => {
        const material = OrderedMaterial.createDefault();
        const provider = new QEPWXInputDataManager(
            {},
            { material, materials: [material], jobHasParent: false, workflowHasRelaxation: false },
        );
        const { CELL_PARAMETERS } = provider.getDefaultData();
        const standard = material.getLattice().vectorArraysInStandardOrientation;

        expect([CELL_PARAMETERS.v1, CELL_PARAMETERS.v2, CELL_PARAMETERS.v3]).to.deep.equal(
            standard,
        );
        // The default material is FCC silicon: (0, 1, 1), (1, 0, 1), (1, 1, 0) times a/2.
        const [x, y, z] = standard[0];
        expect(x).to.be.closeTo(0, 1e-9);
        expect(y).to.be.closeTo(z, 1e-9);
    });
});
