/**
 * Lattice vectors in the orientation Quantum ESPRESSO's symmetry analysis expects.
 *
 * pw.x does not search for symmetry: it tests a fixed list of rotations whose axes lie
 * along its Cartesian x, y and z (and the hexagonal ones about z). Made's lattice
 * vectors follow one convention for every lattice type, with the third vector along z,
 * which leaves the axes of a centred cubic lattice tilted; pw.x then finds 4 of the 48
 * operations of fcc silicon and samples about ten times more k-points than it needs.
 *
 * `standardVectorArrays` rotates the vectors rigidly onto Made's primitive cell for the
 * lattice type, whose cubic axes lie along x, y and z. A rotation leaves the lengths and
 * angles of the vectors, and therefore fractional coordinates, unchanged. Lattices that
 * already have their axes along x, y and z in Made's convention, and those this module has
 * no standard cell for, keep their vectors.
 *
 * Python twin: src/py/mat3ra/wode/context/providers/by_application/espresso/standard_orientation.py
 */
import { math as codeJSMath } from "@mat3ra/code/dist/js/math";
import type { LatticeSchema, Matrix3X3Schema } from "@mat3ra/esse/dist/js/types";
import { getPrimitiveLatticeVectorsFromConfig } from "@mat3ra/made/dist/js/cell/primitive_cell";

/**
 * The primitive cell volume of each type, as a fraction of the cubic cell's a^3.
 */
const PRIMITIVE_VOLUME_FRACTIONS: Partial<Record<string, number>> = { CUB: 1, FCC: 0.25, BCC: 0.5 };
const TOLERANCE = 1e-6;

interface LatticeWithVectors {
    type?: string;
    vectorArrays: Matrix3X3Schema;
    toJSON(): LatticeSchema;
}

/**
 * The lattice vectors rotated onto the standard primitive cell of the lattice's type.
 *
 * The standard cell is Made's for the type, at the cubic constant that gives the same
 * volume. The rotation solves vectors · R = standard; it is used only when R is a proper
 * rotation, so a lattice whose shape does not match its type, or that matches only by a
 * reflection, is left as it is.
 */
export function standardVectorArrays(lattice: LatticeWithVectors): Matrix3X3Schema {
    const vectors = lattice.vectorArrays;
    const fraction = lattice.type ? PRIMITIVE_VOLUME_FRACTIONS[lattice.type] : undefined;
    if (fraction === undefined) return vectors;
    const volume = Math.abs(codeJSMath.det(vectors) as number);
    const cubicConstant = (volume / fraction) ** (1 / 3);
    const standard = getPrimitiveLatticeVectorsFromConfig({
        ...lattice.toJSON(),
        a: cubicConstant,
    });
    const rotation = codeJSMath.multiply(codeJSMath.inv(vectors), standard) as number[][];
    const product = codeJSMath.multiply(codeJSMath.transpose(rotation), rotation) as number[][];
    const orthogonal = product.every((row, i) =>
        row.every((value, j) => Math.abs(value - (i === j ? 1 : 0)) <= TOLERANCE),
    );
    if (!orthogonal || (codeJSMath.det(rotation) as number) <= 0) return vectors;
    return standard;
}
