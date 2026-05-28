"use strict";
/**
 * THIS ENUMS ARE SHARED WITH TESTS.
 * DO NOT IMPORT ANYTHINGS IN THIS MODULE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIT_NAME_INVALID_CHARS = exports.TAB_NAVIGATION_CONFIG = exports.WORKFLOW_STATUSES = exports.UNIT_TAGS = exports.UNIT_STATUSES = exports.UnitType = exports.UNIT_TYPES = exports.IO_ID_COLUMN = void 0;
exports.IO_ID_COLUMN = "exabyteId";
exports.UNIT_TYPES = {
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
    processing: "processing",
    io: "io",
    assertion: "assertion",
};
var UnitType;
(function (UnitType) {
    UnitType["convergence"] = "convergence";
    UnitType["exit"] = "exit";
    UnitType["execution"] = "execution";
    UnitType["map"] = "map";
    UnitType["reduce"] = "reduce";
    UnitType["assignment"] = "assignment";
    UnitType["condition"] = "condition";
    UnitType["subworkflow"] = "subworkflow";
    UnitType["processing"] = "processing";
    UnitType["io"] = "io";
    UnitType["assertion"] = "assertion";
})(UnitType || (exports.UnitType = UnitType = {}));
exports.UNIT_STATUSES = {
    idle: "idle",
    active: "active",
    finished: "finished",
    error: "error",
    warning: "warning",
};
exports.UNIT_TAGS = {
    hasConvergenceParam: "hasConvergenceParam",
    hasConvergenceResult: "hasConvergenceResult",
};
exports.WORKFLOW_STATUSES = {
    "up-to-date": "up-to-date",
    outdated: "outdated",
};
exports.TAB_NAVIGATION_CONFIG = {
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
};
exports.UNIT_NAME_INVALID_CHARS = "/";
