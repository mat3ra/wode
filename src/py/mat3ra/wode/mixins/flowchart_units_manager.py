from typing import List, Optional, TypeVar

from mat3ra.utils import find_by_key_or_regex

from ..units import Unit

T = TypeVar("T")


class FlowchartUnitsManager:
    """
    Mixin class providing common unit operations for flowchart units.

    This mixin expects the class to have a `units: List[Unit]` attribute.
    It provides common methods for managing units in both Workflow and Subworkflow classes.
    """

    units: List[Unit]

    def set_units(self, units: List[Unit]) -> None:
        self.units = units

    def _set_units_order_in_place(self) -> None:
        self.set_units_head(self.units)
        self.set_next_links(self.units)

    def get_unit(self, flowchart_id: str) -> Optional[Unit]:
        for unit in self.units:
            if unit.flowchartId == flowchart_id:
                return unit
        return None

    def find_unit_by_id(self, id: str) -> Optional[Unit]:
        for unit in self.units:
            if getattr(unit, "id", None) == id:
                return unit
        return None

    def find_unit_with_tag(self, tag: str) -> Optional[Unit]:
        for unit in self.units:
            if hasattr(unit, "tags") and unit.tags is not None and tag in unit.tags:
                return unit
        return None

    def get_unit_by_name(
        self,
        name: Optional[str] = None,
        name_regex: Optional[str] = None,
    ) -> Optional[Unit]:
        return find_by_key_or_regex(self.units, key="name", value=name, value_regex=name_regex)

    @staticmethod
    def _add_to_list(items: List[T], item: T, head: bool = False, index: int = -1) -> None:
        """
        Add an item to a list at a specified position.

        Args:
            items: The list to add to
            item: The item to add
            head: If True, insert at the beginning (index 0)
            index: If >= 0, insert at this specific index
                   If < 0, append to the end
        """
        if head:
            items.insert(0, item)
        elif index >= 0:
            items.insert(index, item)
        else:
            items.append(item)

    def set_units_head(self, units: List[Unit]) -> List[Unit]:
        """
        Set the head flag on the first unit and unset it on all others.

        Args:
            units: List of units to process

        Returns:
            The modified units list
        """
        if len(units) > 0:
            units[0].head = True
            for unit in units[1:]:
                unit.head = False
        return units

    def set_next_links(self, units: List[Unit]) -> List[Unit]:
        """
        Re-establishes the linked next => flowchartId logic in an array of units.

        Args:
            units: List of units to process

        Returns:
            The modified units list
        """
        flowchart_ids = [unit.flowchartId for unit in units]

        for i in range(len(units) - 1):
            unit_next = getattr(units[i], "next", None)

            if unit_next is None:
                units[i].next = units[i + 1].flowchartId
            elif unit_next not in flowchart_ids:
                units[i].next = units[i + 1].flowchartId

        return units

    def _clear_link_to_unit(self, flowchart_id: str) -> None:
        """
        Clear the 'next' link from any unit that points to the given flowchart_id.

        This is used to mend broken links when removing a unit.

        Args:
            flowchart_id: The flowchart_id to clear links to
        """
        for unit in self.units:
            if getattr(unit, "next", None) == flowchart_id:
                unit.next = None
                break

    def add_unit(self, unit: Unit, head: bool = False, index: int = -1) -> None:
        """
        Add a unit to the units list.

        Args:
            unit: Unit to add
            head: If True, add at the beginning
            index: If >= 0, insert at this index
        """
        if len(self.units) == 0:
            unit.head = True
            self.set_units([unit])
        else:
            self._add_to_list(self.units, unit, head, index)
            self._set_units_order_in_place()

    def remove_unit(self, flowchart_id: str) -> None:
        """
        Remove a unit by its flowchartId.

        Args:
            flowchart_id: The flowchartId of the unit to remove
        """

        if len(self.units) < 2:
            return

        unit_to_remove = None
        for unit in self.units:
            if unit.flowchartId == flowchart_id:
                unit_to_remove = unit
                break

        if not unit_to_remove:
            return

        self._clear_link_to_unit(unit_to_remove.flowchartId)

        remaining_units = [unit for unit in self.units if unit.flowchartId != flowchart_id]
        self.units = remaining_units
        self._set_units_order_in_place()

    def replace_unit(self, index: int, unit: Unit) -> None:
        """
        Replace a unit at a specific index.

        Args:
            index: Index of the unit to replace
            unit: New unit to place at that index
        """

        if 0 <= index < len(self.units):
            self.units[index] = unit
            self._set_units_order_in_place()

    def set_unit(
        self,
        new_unit: Unit,
        unit: Optional[Unit] = None,
        unit_flowchart_id: Optional[str] = None,
    ) -> bool:
        """
        Replace a unit by finding it either by instance or flowchart_id.
        Unit can replace itself if it was modified outside the class.

        Args:
            new_unit: The new unit to set
            unit: The existing unit instance to replace (optional)
            unit_flowchart_id: The flowchart_id of the unit to replace (optional)

        If neither unit nor unit_flowchart_id is provided, the function will use
        new_unit.flowchartId to find the existing unit to replace.

        Returns:
            True if successful, False otherwise
        """
        if unit is not None:
            target_unit = unit
        elif unit_flowchart_id is not None:
            target_unit = self.get_unit(unit_flowchart_id)
        else:
            target_unit = self.get_unit(new_unit.flowchartId)

        if target_unit is None:
            return False

        try:
            unit_index = self.units.index(target_unit)
            self.replace_unit(unit_index, new_unit)
            return True
        except ValueError:
            return False
