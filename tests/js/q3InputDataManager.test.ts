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
import Q3InputDataManager from "../../src/js/context/providers/by_application/q3/Q3InputDataManager";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

const siliconPseudopotentialPath =
    "/export/share/pseudo/si/gga/pbe/gbrv/1.0/us/si_pbe_gbrv_1.0.upf";

/**
 * q3 reads pseudopotential files from the shared pseudopotential store, so its input references
 * their full path rather than the file name pw.x resolves inside `pseudo_dir`.
 */
describe("Q3InputDataManager", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    const material = OrderedMaterial.createDefault();
    const externalContext = {
        material,
        materials: [material],
        jobHasParent: false,
        workflowHasRelaxation: false,
        methodData: {
            pseudo: [
                {
                    element: "Si" as const,
                    filename: "si_pbe_gbrv_1.0.upf",
                    path: siliconPseudopotentialPath,
                },
            ],
        },
    };

    it("references the pseudopotential by its full path", () => {
        const provider = new Q3InputDataManager({}, externalContext);

        const { ATOMIC_SPECIES, ATOMIC_SPECIES_WITH_LABELS } = provider.getDefaultData();

        expect(ATOMIC_SPECIES[0].PseudoPot_X).to.equal(siliconPseudopotentialPath);
        expect(ATOMIC_SPECIES_WITH_LABELS[0].PseudoPot_X).to.equal(siliconPseudopotentialPath);
    });

    it("leaves the espresso provider referencing the file name", () => {
        const provider = new QEPWXInputDataManager({}, externalContext);

        expect(provider.getDefaultData().ATOMIC_SPECIES[0].PseudoPot_X).to.equal(
            "si_pbe_gbrv_1.0.upf",
        );
    });
});
