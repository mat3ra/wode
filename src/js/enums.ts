export const UNIT_TYPES = {
    // not currently used
    convergence: "convergence",
    exit: "exit",
    // actively used
    execution: "execution",
    map: "map",
    reduce: "reduce",
    assignment: "assignment",
    condition: "condition",
    subworkflow: "subworkflow",
    io: "io",
    assertion: "assertion",
} as const;

export enum UnitType {
    convergence = "convergence",
    exit = "exit",
    execution = "execution",
    map = "map",
    reduce = "reduce",
    assignment = "assignment",
    condition = "condition",
    subworkflow = "subworkflow",
    io = "io",
    assertion = "assertion",
}

export enum UnitTag {
    hasConvergenceParam = "hasConvergenceParam",
    hasConvergenceResult = "hasConvergenceResult",
}

export enum UnitStatus {
    idle = "idle",
    active = "active",
    finished = "finished",
    error = "error",
    warning = "warning",
}

export const WORKFLOW_STATUSES = {
    "up-to-date": "up-to-date",
    outdated: "outdated",
} as const;

export const TAB_NAVIGATION_CONFIG = {
    overview: {
        itemName: "Overview",
        className: "",
        href: "sw-overview",
    },
    importantSettings: {
        itemName: "Important settings",
        className: "",
        href: "sw-important-settings",
    },
    detailedView: {
        itemName: "Detailed view",
        className: "",
        href: "sw-detailed-view",
    },
    compute: {
        itemName: "Compute",
        className: "",
        href: "sw-compute",
    },
} as const;

export const UNIT_NAME_INVALID_CHARS = "/";
