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
import { MaterialStandata } from "@mat3ra/standata";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import QEPWXInputDataManager from "../../src/js/context/providers/by_application/espresso/QEPWXInputDataManager";
import CollinearMagnetizationDataManager from "../../src/js/context/providers/CollinearMagnetizationDataManager";
import HubbardContextManagerLegacy from "../../src/js/context/providers/Hubbard/HubbardContextManagerLegacy";
import HubbardJContextManager from "../../src/js/context/providers/Hubbard/HubbardJContextManager";
import HubbardUContextManager from "../../src/js/context/providers/Hubbard/HubbardUContextManager";
import NonCollinearMagnetizationDataManager from "../../src/js/context/providers/NonCollinearMagnetizationDataManager";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

const buildQEPWXData = (material: OrderedMaterial) =>
    new QEPWXInputDataManager(
        {},
        { material, materials: [material], jobHasParent: false, workflowHasRelaxation: false },
    ).getDefaultData();

const buildFeO = (magneticMoments: number[]) => {
    const material = new OrderedMaterial(
        MaterialStandata.getRuntimeDataConfigs().find((config) => config.name.includes("FeO")),
    );
    material.setBasis({
        ...material.getBasis().toJSON(),
        magneticMoments: magneticMoments.map((value, id) => ({ id, value })),
    });
    return material;
};

describe("Atomic species from element and magnetic moment", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    const siliconGermanium = OrderedMaterial.createDefault();
    siliconGermanium.setBasis({
        ...siliconGermanium.getBasis().toJSON(),
        elements: [
            { id: 0, value: "Si" },
            { id: 1, value: "Ge" },
        ],
        labels: [
            { id: 0, value: 0 },
            { id: 1, value: 1 },
        ],
    });
    const antiferromagneticFeO = buildFeO([0.5, -0.5]);
    const ferromagneticFeO = buildFeO([0.5, 0.5]);
    const externalContext = { material: antiferromagneticFeO };
    const species = ["Fe", "Fe1", "O"];

    it("writes a Si / Ge cell labelled 0 and 1 with species Si and Ge", () => {
        const data = buildQEPWXData(siliconGermanium);

        expect(data.ATOMIC_SPECIES_WITH_LABELS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS).to.match(/^Si .*\nGe /);
    });

    it("splits an element into one species per magnetic moment", () => {
        const data = buildQEPWXData(antiferromagneticFeO);

        expect(data.ATOMIC_SPECIES.map(({ X }) => X)).to.deep.equal(species);
        expect([data.NTYP, data.NTYP_WITH_LABELS]).to.deep.equal([3, 3]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Fe", "Fe1", "O", "O"]);
    });

    [
        { Provider: CollinearMagnetizationDataManager, spinAngleSpecies: undefined },
        { Provider: NonCollinearMagnetizationDataManager, spinAngleSpecies: species },
    ].forEach(({ Provider, spinAngleSpecies }) => {
        it(`${Provider.name} shows the material's species limited to [-1, 1], not stored rows`, () => {
            const storedData = new Provider({}, { material: buildFeO([2.2, -2.2]) }).getData();
            const provider = new Provider({ data: storedData } as never, {
                material: ferromagneticFeO,
            });

            expect(storedData.startingMagnetization).to.deep.equal([
                { index: 1, atomicSpecies: "Fe", value: 1 },
                { index: 2, atomicSpecies: "Fe1", value: -1 },
                { index: 3, atomicSpecies: "O", value: 0 },
            ]);
            expect(
                "spinAngles" in storedData
                    ? storedData.spinAngles?.map(({ atomicSpecies }) => atomicSpecies)
                    : undefined,
            ).to.deep.equal(spinAngleSpecies);
            expect(provider.getData().startingMagnetization).to.deep.equal([
                { index: 1, atomicSpecies: "Fe", value: 0.5 },
                { index: 2, atomicSpecies: "O", value: 0 },
            ]);
        });
    });

    [
        {
            Provider: HubbardUContextManager,
            row: { atomicSpecies: "Fe", atomicOrbital: "3d", hubbardUValue: 4 },
        },
        {
            Provider: HubbardJContextManager,
            row: { atomicSpecies: "Fe", atomicOrbital: "3d", paramType: "J" as const, value: 1 },
        },
    ].forEach(({ Provider, row }) => {
        it(`${Provider.name} applies a row of an element to each of its species`, () => {
            const provider = new Provider({ data: [row] } as never, externalContext);

            expect(provider.getDataForRendering()).to.deep.equal([
                row,
                { ...row, atomicSpecies: "Fe1" },
            ]);
        });
    });

    it("refuses to render a stored Hubbard U row keyed by a labelled species", () => {
        const data = [{ atomicSpecies: "Fe1", atomicOrbital: "3d", hubbardUValue: 4 }];
        const provider = new HubbardUContextManager({ data }, externalContext);

        expect(() => provider.getDataForRendering()).to.throw(
            'Hubbard row "Fe1" is not an element of this material; enter Hubbard parameters per element: Fe, O',
        );
    });

    it("indexes legacy Hubbard U rows by species", () => {
        const rowFe = { atomicSpecies: "Fe", atomicSpeciesIndex: 1, hubbardUValue: 4 };
        const rowO = { atomicSpecies: "O", atomicSpeciesIndex: 2, hubbardUValue: 1 };
        const provider = new HubbardContextManagerLegacy({ data: [rowFe, rowO] }, externalContext);

        expect(provider.getData()).to.deep.equal([rowFe, { ...rowO, atomicSpeciesIndex: 3 }]);
        expect(provider.getDataForRendering()).to.deep.equal([
            rowFe,
            { ...rowFe, atomicSpecies: "Fe1", atomicSpeciesIndex: 2 },
            { ...rowO, atomicSpeciesIndex: 3 },
        ]);
    });
});
