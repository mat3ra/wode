"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsedApplications = getUsedApplications;
exports.getSystemName = getSystemName;
exports.getUsedModels = getUsedModels;
exports.getDefaultDescription = getDefaultDescription;
exports.getProperties = getProperties;
exports.getHumanReadableProperties = getHumanReadableProperties;
exports.getHumanReadableUsedModels = getHumanReadableUsedModels;
exports.resetUnitsStatuses = resetUnitsStatuses;
const tree_1 = require("@mat3ra/mode/dist/js/tree");
const underscore_string_1 = __importDefault(require("underscore.string"));
const baseUnits_1 = require("./baseUnits");
function getUsedApplications(workflow) {
    const swApplications = workflow.subworkflows.map((sw) => sw.application);
    const nestedWorkflows = workflow.workflows;
    const wfApplications = nestedWorkflows.map(getUsedApplications).flat();
    return [...swApplications, ...wfApplications].reduce((acc, app) => {
        if (!acc.some((a) => a.name === app.name)) {
            acc.push(app);
        }
        return acc;
    }, []);
}
function getSystemName(workflow) {
    const applicationNames = getUsedApplications(workflow).map((a) => a.name);
    return underscore_string_1.default.slugify(`${applicationNames.join(":")}-${workflow.name}`);
}
function getUsedModels(workflow) {
    return workflow.subworkflows.map((sw) => sw.model.type);
}
function getDefaultDescription(workflow) {
    const applicationNames = getUsedApplications(workflow).map((a) => a.name);
    return `${getUsedModels(workflow)
        .join(", ")
        .toUpperCase()} workflow using ${applicationNames.join(", ")}.`;
}
function getProperties(workflow) {
    return [...new Set(workflow.subworkflows.map((sw) => sw.properties || []).flat())];
}
function getHumanReadableProperties(workflow) {
    return getProperties(workflow).map((name) => name
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" "));
}
function getHumanReadableUsedModels(workflow) {
    return getUsedModels(workflow)
        .filter((m) => m !== "unknown")
        .map((m) => tree_1.MODEL_NAMES[m]);
}
function resetUnitsStatuses(workflow) {
    var _a;
    return {
        ...workflow,
        subworkflows: workflow.subworkflows.map((subworkflow) => {
            return {
                ...subworkflow,
                units: subworkflow.units.map(baseUnits_1.resetStatus),
            };
        }),
        workflows: (_a = workflow.workflows) === null || _a === void 0 ? void 0 : _a.map((wf) => resetUnitsStatuses(wf)),
    };
}
