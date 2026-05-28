export declare const UNIT_TYPES: {
    readonly convergence: "convergence";
    readonly exit: "exit";
    readonly execution: "execution";
    readonly map: "map";
    readonly reduce: "reduce";
    readonly assignment: "assignment";
    readonly condition: "condition";
    readonly subworkflow: "subworkflow";
    readonly io: "io";
    readonly assertion: "assertion";
};
export declare enum UnitType {
    convergence = "convergence",
    exit = "exit",
    execution = "execution",
    map = "map",
    reduce = "reduce",
    assignment = "assignment",
    condition = "condition",
    subworkflow = "subworkflow",
    io = "io",
    assertion = "assertion"
}
export declare enum UnitTag {
    hasConvergenceParam = "hasConvergenceParam",
    hasConvergenceResult = "hasConvergenceResult"
}
export declare enum UnitStatus {
    idle = "idle",
    active = "active",
    finished = "finished",
    error = "error",
    warning = "warning"
}
export declare const WORKFLOW_STATUSES: {
    readonly "up-to-date": "up-to-date";
    readonly outdated: "outdated";
};
export declare const TAB_NAVIGATION_CONFIG: {
    readonly overview: {
        readonly itemName: "Overview";
        readonly className: "";
        readonly href: "sw-overview";
    };
    readonly importantSettings: {
        readonly itemName: "Important settings";
        readonly className: "";
        readonly href: "sw-important-settings";
    };
    readonly detailedView: {
        readonly itemName: "Detailed view";
        readonly className: "";
        readonly href: "sw-detailed-view";
    };
    readonly compute: {
        readonly itemName: "Compute";
        readonly className: "";
        readonly href: "sw-compute";
    };
};
export declare const UNIT_NAME_INVALID_CHARS = "/";
