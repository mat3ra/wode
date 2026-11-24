import numpy as np
import pytest
from mat3ra.made.lattice import Lattice
from mat3ra.made.material import Material, defaultMaterialConfig
from mat3ra.wode.context.providers.by_application.espresso.standard_orientation import (
    standard_vector_arrays,
)


def lattice(lattice_type, length, angle):
    return Lattice(type=lattice_type, a=length, b=length, c=length, alpha=angle, beta=angle, gamma=angle)


def assert_same_shape(before, after):
    """
    A rigid rotation: same lengths and angles (so the same fractional coordinates), same handedness.
    """
    before, after = np.array(before), np.array(after)
    assert after @ after.T == pytest.approx(before @ before.T, abs=1e-9)
    assert np.linalg.det(after) == pytest.approx(np.linalg.det(before), rel=1e-9)


@pytest.mark.parametrize(
    ("lattice_type", "angle", "cubic_directions"),
    [
        ("FCC", 60.0, [[0, 1, 1], [1, 0, 1], [1, 1, 0]]),
        ("BCC", float(np.degrees(np.arccos(-1 / 3))), [[-1, 1, 1], [1, -1, 1], [1, 1, -1]]),
        ("CUB", 90.0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
    ],
)
def test_cubic_lattices_are_rotated_onto_the_cubic_axes(lattice_type, angle, cubic_directions):
    cell = lattice(lattice_type, 2.62, angle)
    rotated = np.array(standard_vector_arrays(cell))
    assert_same_shape(cell.vector_arrays, rotated)
    # Each vector is the largest component times its direction: a/2 for FCC and BCC, a for CUB.
    assert rotated == pytest.approx(abs(rotated).max() * np.array(cubic_directions), abs=1e-9)


def test_the_default_material_keeps_its_volume_and_fractional_coordinates():
    material = Material.create(defaultMaterialConfig)
    assert material.lattice.type.value == "FCC"
    assert_same_shape(material.lattice.vector_arrays, standard_vector_arrays(material.lattice))


@pytest.mark.parametrize(
    "cell",
    [
        lattice("TRI", 3.0, 70.0),  # no standard cell here
        lattice("FCC", 2.62, 70.0),  # labelled FCC but not shaped like one
        Lattice(type="HEX", a=3.0, b=3.0, c=5.0, alpha=90.0, beta=90.0, gamma=120.0),  # already standard
    ],
)
def test_other_lattices_keep_their_vectors(cell):
    assert standard_vector_arrays(cell) == pytest.approx(np.array(cell.vector_arrays), abs=1e-12)
