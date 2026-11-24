"""
Lattice vectors in the orientation Quantum ESPRESSO's symmetry analysis expects.

pw.x does not search for symmetry: it tests a fixed list of rotations whose axes lie
along its Cartesian x, y and z (and the hexagonal ones about z). Made's lattice
vectors follow one convention for every lattice type, with the third vector along z,
which leaves the axes of a centred cubic lattice tilted; pw.x then finds 4 of the 48
operations of fcc silicon and samples about ten times more k-points than it needs.

`standard_vector_arrays` rotates the vectors rigidly onto Made's primitive cell for the
lattice type, whose cubic axes lie along x, y and z. A rotation leaves the lengths and
angles of the vectors, and therefore fractional coordinates, unchanged. Lattices that
already have their axes along x, y and z in Made's convention, and those this module has
no standard cell for, keep their vectors.
"""

from types import SimpleNamespace
from typing import List

import numpy as np
from mat3ra.made.cell.primitive_cell import PRIMITIVE_CELLS

# The primitive cell volume of each type, as a fraction of the cubic cell's a^3.
PRIMITIVE_VOLUME_FRACTIONS = {"CUB": 1.0, "FCC": 0.25, "BCC": 0.5}
TOLERANCE = 1e-6


def standard_vector_arrays(lattice) -> List[List[float]]:
    """
    The lattice vectors rotated onto the standard primitive cell of the lattice's type.

    The standard cell is Made's for the type, at the cubic constant that gives the same
    volume. The rotation solves vectors @ R = standard; it is used only when R is a proper
    rotation, so a lattice whose shape does not match its type, or that matches only by a
    reflection, is left as it is.

    JavaScript twin: src/js/context/providers/by_application/espresso/standardOrientation.ts
    """
    vectors = np.array(lattice.vector_arrays, dtype=float)
    lattice_type = lattice.type.value if lattice.type else None
    if lattice_type not in PRIMITIVE_VOLUME_FRACTIONS:
        return vectors.tolist()
    volume = abs(np.linalg.det(vectors))
    cubic_constant = (volume / PRIMITIVE_VOLUME_FRACTIONS[lattice_type]) ** (1 / 3)
    standard = np.array(PRIMITIVE_CELLS[lattice_type](SimpleNamespace(a=cubic_constant)), dtype=float)
    rotation = np.linalg.solve(vectors, standard)
    orthogonal = np.allclose(rotation.T @ rotation, np.eye(3), rtol=0, atol=TOLERANCE)
    if not orthogonal or np.linalg.det(rotation) <= 0:
        return vectors.tolist()
    return standard.tolist()
