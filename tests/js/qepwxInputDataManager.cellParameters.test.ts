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
 * CELL_PARAMETERS stays Made's lattice vectors; CELL_PARAMETERS_STANDARD_REPRESENTATION is
 * the same cell in the lattice type's standard orientation, for templates that opt in so
 * pw.x, which looks for symmetry only about its Cartesian axes, finds the full point group.
 */
describe("QEPWXInputDataManager cell parameters", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    it("keeps the lattice vectors and adds the standard representation", () => {
        const material = OrderedMaterial.createDefault();
        const provider = new QEPWXInputDataManager(
            {},
            { material, materials: [material], jobHasParent: false, workflowHasRelaxation: false },
        );
        const data = provider.getDefaultData();
        const lattice = material.getLattice();
        const { CELL_PARAMETERS, CELL_PARAMETERS_STANDARD_REPRESENTATION: standard } = data;

        expect([CELL_PARAMETERS.v1, CELL_PARAMETERS.v2, CELL_PARAMETERS.v3]).to.deep.equal(
            lattice.vectorArrays,
        );
        expect([standard.v1, standard.v2, standard.v3]).to.deep.equal(
            lattice.vectorArraysInStandardOrientation,
        );
        // The default material is FCC silicon: (0, 1, 1), (1, 0, 1), (1, 1, 0) times a/2.
        const [x, y, z] = lattice.vectorArraysInStandardOrientation[0];
        expect(x).to.be.closeTo(0, 1e-9);
        expect(y).to.be.closeTo(z, 1e-9);
    });
});
