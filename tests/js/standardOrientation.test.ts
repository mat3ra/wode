import { math as codeJSMath } from "@mat3ra/code/dist/js/math";
import type { Matrix3X3Schema } from "@mat3ra/esse/dist/js/types";
import { Lattice, Material } from "@mat3ra/made";
import { expect } from "chai";

import { standardVectorArrays } from "../../src/js/context/providers/by_application/espresso/standardOrientation";

const TOLERANCE = 1e-9;

function lattice(type: string, length: number, angle: number) {
    return new Lattice({
        type,
        a: length,
        b: length,
        c: length,
        alpha: angle,
        beta: angle,
        gamma: angle,
    } as ConstructorParameters<typeof Lattice>[0]);
}

function expectClose(actual: number[][], expected: number[][]) {
    actual.forEach((row, i) =>
        row.forEach((value, j) => expect(value).to.be.closeTo(expected[i][j], TOLERANCE)),
    );
}

/**
 * A rigid rotation: same lengths and angles (so the same fractional coordinates), same handedness.
 */
function expectSameShape(before: Matrix3X3Schema, after: Matrix3X3Schema) {
    const gram = (vectors: Matrix3X3Schema) =>
        codeJSMath.multiply(vectors, codeJSMath.transpose(vectors)) as number[][];
    expectClose(gram(after), gram(before));
    expect(codeJSMath.det(after) as number).to.be.closeTo(
        codeJSMath.det(before) as number,
        TOLERANCE,
    );
}

describe("standardVectorArrays", () => {
    const cases: [string, number, number[][]][] = [
        [
            "FCC",
            60,
            [
                [0, 1, 1],
                [1, 0, 1],
                [1, 1, 0],
            ],
        ],
        [
            "BCC",
            (Math.acos(-1 / 3) * 180) / Math.PI,
            [
                [-1, 1, 1],
                [1, -1, 1],
                [1, 1, -1],
            ],
        ],
        [
            "CUB",
            90,
            [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ],
        ],
    ];

    cases.forEach(([type, angle, directions]) => {
        it(`rotates a ${type} lattice onto the cubic axes`, () => {
            const cell = lattice(type, 2.62, angle);
            const rotated = standardVectorArrays(cell);
            expectSameShape(cell.vectorArrays, rotated);
            // Each vector is the largest component times its direction: a/2 for FCC and BCC, a for CUB.
            const scale = Math.max(...rotated.flat().map(Math.abs));
            expectClose(
                rotated,
                directions.map((row) => row.map((value) => value * scale)),
            );
        });
    });

    it("keeps the default material's volume and fractional coordinates", () => {
        const lattice = Material.createDefault().getLattice();
        expect(lattice.type).to.equal("FCC");
        expectSameShape(lattice.vectorArrays, standardVectorArrays(lattice));
    });

    it("keeps the vectors of a lattice it has no standard cell for", () => {
        const cell = lattice("TRI", 3, 70);
        expectClose(standardVectorArrays(cell), cell.vectorArrays);
    });

    it("keeps the vectors of a lattice not shaped like its type", () => {
        const cell = lattice("FCC", 2.62, 70);
        expectClose(standardVectorArrays(cell), cell.vectorArrays);
    });
});
