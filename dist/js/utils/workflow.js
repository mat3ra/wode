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
exports.calculateHash = calculateHash;
exports.getHumanReadableProperties = getHumanReadableProperties;
exports.getHumanReadableUsedModels = getHumanReadableUsedModels;
const tree_1 = require("@mat3ra/mode/dist/js/tree");
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const underscore_string_1 = __importDefault(require("underscore.string"));
const subworkflow_1 = require("./subworkflow");
const units_1 = require("./units");
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
function calculateHash(workflow) {
    return utils_1.Utils.hash.calculateHashFromObject({
        units: (0, standata_1.setUnitLinks)(workflow.units).map(units_1.calculateHash).join(),
        subworkflows: workflow.subworkflows.map(subworkflow_1.calculateHash).join(),
        workflows: workflow.workflows.map(calculateHash).join(),
    });
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
