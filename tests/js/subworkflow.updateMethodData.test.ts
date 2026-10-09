import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import esseSchemas from "@mat3ra/esse/dist/js/schemas.json";
import { Material } from "@mat3ra/made";
import { MetaPropertyHolder } from "@mat3ra/prode";
import { expect } from "chai";
import type { JSONSchema7 } from "json-schema";

import { Subworkflow } from "../../src/js";

const espressoUltrasoftSiliconPseudopotential = {
    element: "Si",
    hash: "9d3353ad597f4669d598900a4a25d674",
    filename: "si_pbe_gbrv_1.0.upf",
    path: "/export/share/pseudo/si/gga/pbe/gbrv/1.0/us/si_pbe_gbrv_1.0.upf",
    apps: ["espresso"],
    exchangeCorrelation: { functional: "pbe", approximation: "gga" },
    name: "pseudopotential",
    source: "gbrv",
    type: "us",
    version: "1.0",
};

function createSubworkflow(applicationName: string) {
    return new Subworkflow({
        _id: `${applicationName}-total-energy`,
        name: "Total Energy",
        application: { name: applicationName },
        properties: [],
        model: {
            type: "dft",
            subtype: "gga",
            functional: "pbe",
            method: { type: "pseudopotential", subtype: "us", data: {} },
        },
        units: [],
        schemaVersion: "2022.8.16",
        isDraft: false,
    } as unknown as ConstructorParameters<typeof Subworkflow>[0]);
}

function getSelectedPseudopotentialPaths(subworkflow: Subworkflow) {
    const { pseudo } = subworkflow.model.method.data as {
        pseudo?: { path: string }[];
    };
    return (pseudo || []).map((item) => item.path);
}

describe("Subworkflow.updateMethodData", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    const material = Material.createDefault();
    const metaProperties = [
        new MetaPropertyHolder({
            slug: "pseudopotential",
            data: espressoUltrasoftSiliconPseudopotential,
        } as unknown as ConstructorParameters<typeof MetaPropertyHolder>[0]),
    ];

    it("selects a pseudopotential for the application it is shipped for", () => {
        const subworkflow = createSubworkflow("espresso");

        subworkflow.updateMethodData([material], metaProperties);

        expect(getSelectedPseudopotentialPaths(subworkflow)).to.deep.equal([
            espressoUltrasoftSiliconPseudopotential.path,
        ]);
    });

    it("selects a pseudopotential reused from a compatible application", () => {
        const subworkflow = createSubworkflow("q3");

        subworkflow.updateMethodData([material], metaProperties);

        expect(getSelectedPseudopotentialPaths(subworkflow)).to.deep.equal([
            espressoUltrasoftSiliconPseudopotential.path,
        ]);
    });

    it("selects nothing for an application with no compatible pseudopotentials", () => {
        const subworkflow = createSubworkflow("vasp");

        subworkflow.updateMethodData([material], metaProperties);

        expect(getSelectedPseudopotentialPaths(subworkflow)).to.deep.equal([]);
    });
});
