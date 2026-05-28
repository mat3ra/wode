"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIT_NAME_INVALID_CHARS = exports.TAB_NAVIGATION_CONFIG = exports.WORKFLOW_STATUSES = exports.UnitStatus = exports.UnitTag = exports.UnitType = exports.UNIT_TYPES = void 0;
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
    UnitType["io"] = "io";
    UnitType["assertion"] = "assertion";
})(UnitType || (exports.UnitType = UnitType = {}));
var UnitTag;
(function (UnitTag) {
    UnitTag["hasConvergenceParam"] = "hasConvergenceParam";
    UnitTag["hasConvergenceResult"] = "hasConvergenceResult";
})(UnitTag || (exports.UnitTag = UnitTag = {}));
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["idle"] = "idle";
    UnitStatus["active"] = "active";
    UnitStatus["finished"] = "finished";
    UnitStatus["error"] = "error";
    UnitStatus["warning"] = "warning";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
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
