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
import NWChemInputDataManager from "../../src/js/context/providers/by_application/nwchem/NWChemInputDataManager";
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
    const antiferromagneticRows = [
        { index: 1, atomicSpecies: "Fe", value: 0.5 },
        { index: 2, atomicSpecies: "Fe1", value: -0.5 },
        { index: 3, atomicSpecies: "O", value: 0 },
    ];
    const ferromagneticRows = [
        { index: 1, atomicSpecies: "Fe", value: 0.5 },
        { index: 2, atomicSpecies: "O", value: 0 },
    ];

    it("writes a Si / Ge cell labelled 0 and 1 with species Si and Ge", () => {
        const data = buildQEPWXData(siliconGermanium);

        expect(data.ATOMIC_SPECIES_WITH_LABELS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS).to.match(/^Si .*\nGe /);
    });

    it("writes NWChem positions of the labelled Si / Ge cell with elements", () => {
        const { ATOMIC_POSITIONS } = new NWChemInputDataManager(
            {},
            { material: siliconGermanium, jobHasParent: false, workflowHasRelaxation: false },
        ).getDefaultData();

        expect(ATOMIC_POSITIONS).to.match(/^Si .*\nGe /);
    });

    it("splits an element into one species per magnetic moment", () => {
        const data = buildQEPWXData(antiferromagneticFeO);

        expect(data.ATOMIC_SPECIES.map(({ X }) => X)).to.deep.equal(species);
        expect([data.NTYP, data.NTYP_WITH_LABELS]).to.deep.equal([3, 3]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Fe", "Fe1", "O", "O"]);
    });

    it("shows collinear starting magnetization of the material's species, not stored rows", () => {
        const storedData = new CollinearMagnetizationDataManager({}, externalContext).getData();
        const provider = new CollinearMagnetizationDataManager(
            { data: storedData },
            { material: ferromagneticFeO },
        );

        expect(storedData.startingMagnetization).to.deep.equal(antiferromagneticRows);
        expect(provider.getData().startingMagnetization).to.deep.equal(ferromagneticRows);
    });

    it("shows non-collinear starting magnetization of the material's species, not stored rows", () => {
        const storedData = new NonCollinearMagnetizationDataManager({}, externalContext).getData();
        const provider = new NonCollinearMagnetizationDataManager(
            { data: storedData },
            { material: ferromagneticFeO },
        );

        expect(storedData.startingMagnetization).to.deep.equal(antiferromagneticRows);
        expect(storedData.spinAngles?.map(({ atomicSpecies }) => atomicSpecies)).to.deep.equal(
            species,
        );
        expect(provider.getData().startingMagnetization).to.deep.equal(ferromagneticRows);
    });

    it("applies a Hubbard U row of an element to each of its species", () => {
        const row = { atomicSpecies: "Fe", atomicOrbital: "3d", hubbardUValue: 4 };
        const provider = new HubbardUContextManager({ data: [row] }, externalContext);

        expect(provider.getDataForRendering()).to.deep.equal([
            row,
            { ...row, atomicSpecies: "Fe1" },
        ]);
    });

    it("refuses to render a stored Hubbard U row keyed by a labelled species", () => {
        const row = { atomicOrbital: "3d", hubbardUValue: 4 };
        const data = [
            { ...row, atomicSpecies: "Fe1" },
            { ...row, atomicSpecies: "Fe2" },
            { atomicSpecies: "O", atomicOrbital: "2p", hubbardUValue: 2 },
        ];
        const provider = new HubbardUContextManager({ data }, externalContext);

        expect(() => provider.getDataForRendering()).to.throw(
            'Hubbard row "Fe1" is not an element of this material; enter Hubbard parameters per element: Fe, O',
        );
    });

    it("applies Hubbard U and J rows of an element to each of its species", () => {
        const row = { atomicSpecies: "Fe", atomicOrbital: "3d", value: 1 };
        const rowU = { ...row, paramType: "U" as const };
        const rowJ = { ...row, paramType: "J" as const };
        const provider = new HubbardJContextManager({ data: [rowU, rowJ] }, externalContext);

        expect(provider.getDataForRendering()).to.deep.equal([
            rowU,
            { ...rowU, atomicSpecies: "Fe1" },
            rowJ,
            { ...rowJ, atomicSpecies: "Fe1" },
        ]);
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
