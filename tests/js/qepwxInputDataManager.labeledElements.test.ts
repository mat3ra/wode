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

describe("Species from element and starting magnetization", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    const antiferromagneticFeO = new OrderedMaterial(
        MaterialStandata.getRuntimeDataConfigs().find((config) => config.name.includes("FeO")),
    );
    antiferromagneticFeO.setBasis({
        ...antiferromagneticFeO.getBasis().toJSON(),
        startingMagnetization: [
            { id: 0, value: 0.5 },
            { id: 1, value: -0.5 },
        ],
    });
    const externalContext = { material: antiferromagneticFeO };
    const species = ["Fe", "Fe1", "O"];
    const rows = [
        { index: 1, atomicSpecies: "Fe", value: 0.5 },
        { index: 2, atomicSpecies: "Fe1", value: -0.5 },
        { index: 3, atomicSpecies: "O", value: 0 },
    ];

    it("writes a labelled interface with element species", () => {
        const material = OrderedMaterial.createDefault();
        material.setBasis({
            ...material.getBasis().toJSON(),
            elements: [
                { id: 0, value: "Si" },
                { id: 1, value: "Ge" },
            ],
            labels: [
                { id: 0, value: 0 },
                { id: 1, value: 1 },
            ],
        });
        const data = buildQEPWXData(material);
        const { ATOMIC_POSITIONS } = new NWChemInputDataManager(
            {},
            { material, jobHasParent: false, workflowHasRelaxation: false },
        ).getDefaultData();

        expect(data.ATOMIC_SPECIES_WITH_LABELS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Si", "Ge"]);
        expect(data.ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS).to.match(/^Si .*\nGe /);
        expect(ATOMIC_POSITIONS).to.match(/^Si .*\nGe /);
    });

    it("splits an element into one species per starting magnetization", () => {
        const data = buildQEPWXData(antiferromagneticFeO);

        expect(data.ATOMIC_SPECIES.map(({ X }) => X)).to.deep.equal(species);
        expect([data.NTYP, data.NTYP_WITH_LABELS]).to.deep.equal([3, 3]);
        expect(data.ATOMIC_POSITIONS.map(({ X }) => X)).to.deep.equal(["Fe", "Fe1", "O", "O"]);
    });

    it("takes starting magnetization rows from the species, not from stored rows", () => {
        const storedData = {
            startingMagnetization: [{ index: 1, atomicSpecies: "Fe1", value: 0.1 }],
            isTotalMagnetization: false,
            totalMagnetization: 0,
        };
        [CollinearMagnetizationDataManager, NonCollinearMagnetizationDataManager].forEach(
            (Provider) => {
                const storedProvider = new Provider({ data: storedData }, externalContext);

                expect(
                    new Provider({}, externalContext).getData().startingMagnetization,
                ).to.deep.equal(rows);
                expect(storedProvider.getDataForRendering().startingMagnetization).to.deep.equal(
                    rows,
                );
            },
        );
        const { spinAngles } = new NonCollinearMagnetizationDataManager(
            {},
            externalContext,
        ).getData();
        expect(spinAngles?.map(({ atomicSpecies }) => atomicSpecies)).to.deep.equal(species);
    });

    it("applies a Hubbard U row of an element to each of its species", () => {
        const row = { atomicSpecies: "Fe", atomicOrbital: "3d", hubbardUValue: 4 };
        const hubbardU = new HubbardUContextManager({ data: [row] }, externalContext);
        const hubbardLegacy = new HubbardContextManagerLegacy({ data: [row] }, externalContext);

        expect(hubbardU.getDataForRendering()).to.deep.equal([
            row,
            { ...row, atomicSpecies: "Fe1" },
        ]);
        expect(hubbardLegacy.getDataForRendering()).to.deep.equal([
            { ...row, atomicSpeciesIndex: 1 },
            { ...row, atomicSpeciesIndex: 2 },
        ]);
    });

    it("rejects a species name longer than 3 characters", () => {
        const material = OrderedMaterial.createDefault();
        const ids = [...Array(11).keys()];
        material.setBasis({
            ...material.getBasis().toJSON(),
            elements: ids.map((id) => ({ id, value: "Si" })),
            coordinates: ids.map((id) => ({ id, value: [id / 11, 0, 0] })),
            startingMagnetization: ids.map((id) => ({ id, value: id / 10 })),
        });

        expect(() => buildQEPWXData(material)).to.throw("Si10");
    });
});
