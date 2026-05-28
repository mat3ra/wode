/**
 * THIS ENUMS ARE SHARED WITH TESTS.
 * DO NOT IMPORT ANYTHINGS IN THIS MODULE.
 */
export declare const IO_ID_COLUMN = "exabyteId";
export declare const UNIT_TYPES: {
    convergence: string;
    exit: string;
    execution: string;
    map: string;
    reduce: string;
    assignment: string;
    condition: string;
    subworkflow: string;
    processing: string;
    io: string;
    assertion: string;
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
    processing = "processing",
    io = "io",
    assertion = "assertion"
}
export declare const UNIT_STATUSES: {
    idle: string;
    active: string;
    finished: string;
    error: string;
    warning: string;
};
export declare const UNIT_TAGS: {
    hasConvergenceParam: string;
    hasConvergenceResult: string;
};
export declare const WORKFLOW_STATUSES: {
    "up-to-date": string;
    outdated: string;
};
export declare const TAB_NAVIGATION_CONFIG: {
    overview: {
        itemName: string;
        className: string;
        href: string;
    };
    importantSettings: {
        itemName: string;
        className: string;
        href: string;
    };
    detailedView: {
        itemName: string;
        className: string;
        href: string;
    };
    compute: {
        itemName: string;
        className: string;
        href: string;
    };
};
export declare const UNIT_NAME_INVALID_CHARS = "/";
