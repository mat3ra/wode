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
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

import KGridFormDataManager from "../../src/js/context/providers/PointsGrid/KGridFormDataManager";

interface OrderedMaterial extends OrderedInMemoryEntityInSet, InMemoryEntityInSet {}

class OrderedMaterial extends Material implements OrderedInMemoryEntityInSet {
    declare static createDefault: () => OrderedMaterial;
}

inMemoryEntityInSetMixin(OrderedMaterial.prototype);
orderedEntityInSetMixin(OrderedMaterial.prototype);

function getDimensionsSchema(jsonSchema: JSONSchema7): JSONSchema7Definition {
    const dimensions = jsonSchema.properties?.dimensions;
    expect(dimensions).to.be.an("object");
    return dimensions as JSONSchema7Definition;
}

describe("PointsGridFormDataProvider form jsonSchema", () => {
    before(() => {
        JSONSchemasInterface.setSchemas(esseSchemas as JSONSchema7[]);
    });

    it("exposes number[] dimensions without anyOf for RJSF", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();

        const provider = new KGridFormDataManager(
            { name: "kgrid" },
            { material, isUsingJinjaVariables: false },
        );

        const dimensionsSchema = getDimensionsSchema(provider.jsonSchema);

        expect(dimensionsSchema).to.not.have.property("anyOf");
        expect(dimensionsSchema).to.deep.include({ type: "array", minItems: 3, maxItems: 3 });
        expect((dimensionsSchema as JSONSchema7).items).to.deep.include({ type: "number" });
    });

    it("exposes string[] dimensions when using Jinja variables", () => {
        const material = OrderedMaterial.createDefault();
        material.hash = material.calculateHash();

        const provider = new KGridFormDataManager(
            { name: "kgrid" },
            { material, isUsingJinjaVariables: true },
        );

        const dimensionsSchema = getDimensionsSchema(provider.jsonSchema);

        expect(dimensionsSchema).to.not.have.property("anyOf");
        expect((dimensionsSchema as JSONSchema7).items).to.deep.include({ type: "string" });
    });
});
