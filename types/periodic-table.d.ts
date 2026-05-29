/**
 * Type definition for periodic table element data
 */
interface PeriodicTableElement {
    name: string;
    symbol: string;
    atomic_number: number;
    atomic_mass: number;
    density_g_per_cm3: string | number;
    melting_point_K: number;
    boiling_point_K: number;
    atomic_radius_pm: string | number;
    covalent_radius_pm: number;
    ionic_radius_pm: string;
    van_der_Waals_radius_pm: string | number;
    atomic_volume_cm3_per_mol: string | number;
    specific_heat_J_g_mol: string | number;
    fusion_heat_kJ_mol: string | number;
    evaporation_heat_kJ_mol: string | number;
    thermal_conductivity_25C_W_m_K: string | number;
    pauling_negativity: string | number;
    first_ionizing_kJ_mol: string | number;
    oxidation_states: string | number;
    electronic_configuration: string;
    lattice_structure: string;
    lattice_constant_ang: string | number;
}

/**
 * Periodic table mapping element symbols to element data
 */
type PeriodicTable = {
    [Symbol in string]: PeriodicTableElement;
};

declare module "@exabyte-io/periodic-table.js" {
    export const PERIODIC_TABLE: PeriodicTable;
}

declare module "@exabyte-io/periodic-table.js/lib/js" {
    export const PERIODIC_TABLE: PeriodicTable;
}

declare module "@exabyte-io/periodic-table.js/lib/js/periodic_table" {
    export const PERIODIC_TABLE: PeriodicTable;
}
