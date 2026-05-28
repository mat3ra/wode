"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = createWorkflow;
const create_1 = require("../subworkflows/create");
const units_1 = require("../units");
const map_1 = require("../units/map");
const utils_1 = require("../utils");
const workflow_1 = require("./workflow");
/**
 * @summary Helper for creating Map units for complex workflows
 * @param config {Object} map unit configuration
 * @param unitFactoryCls {*} class factory for map unit
 * @returns {*} map unit
 */
function createMapUnit({ config, unitFactoryCls = units_1.UnitFactory }) {
    let { input: defaultInput } = map_1.defaultMapConfig;
    if (config.input) {
        defaultInput = { ...defaultInput, ...config.input };
    }
    const unit = unitFactoryCls.create({ ...map_1.defaultMapConfig, input: defaultInput });
    return unit;
}
/**
 * @summary Update subworkflow units with patch configuration defined in the workflow config
 * @param subworkflowData {Object} subworkflow data
 * @param unitConfigs {Array<Object>} array of patch configs for subworkflow units
 * @returns subworkflowData {Object} subworkflowData with patches applied to units
 */
function updateUnitConfigs({ subworkflowData, unitConfigs }) {
    unitConfigs.forEach((config) => {
        const { index, type, config: unitConfig } = config; // unitConfig should contain 'attributes' key
        const unit = (0, utils_1.findUnit)({ subworkflowData, index, type });
        console.log(`  patching ${type} unit ${index} of subworkflow ${subworkflowData.name}`);
        unit.config = (0, utils_1.applyConfig)({ obj: unit.config, config: unitConfig });
        return null;
    });
    return subworkflowData;
}
/**
 * @summary Use subworkflow.createSubworkflow to create a Subworkflow unit
 * @param appName {String} application name
 * @param unitData {*} object containing subworkflow configuration data
 * @param workflowData {*} object containing all workflow configuration data
 * @param swArgs {*} subworkflow classes
 * @returns {*} subworkflow object
 */
function createSubworkflowUnit({ appName, unitData, workflowData, cache, ...swArgs }) {
    const { name: unitName, unitConfigs, config } = unitData;
    const { subworkflows } = workflowData;
    const { [appName]: dataByApp } = subworkflows;
    let { [unitName]: subworkflowData } = dataByApp;
    subworkflowData.config = { ...subworkflowData.config, ...config };
    if (unitConfigs)
        subworkflowData = updateUnitConfigs({ subworkflowData, unitConfigs });
    return (0, create_1.createSubworkflow)({
        subworkflowData,
        cache,
        ...swArgs,
    });
}
/**
 * @summary Create the first workflow object specified in a workflow configuration
 * @param workflow {*|null} the workflow (if already initialized, no-op)
 * @param unit {*} workflow unit object
 * @param type {String} value in ["workflow", "subworkflow"]
 * @param workflowCls {*} workflow class
 * @returns {Workflow|*} workflow object
 */
function createWorkflowHead({ workflow, unit, type, workflowCls }) {
    if (workflow)
        return workflow;
    let wf;
    switch (type) {
        case "workflow":
            wf = unit;
            break;
        case "subworkflow":
            wf = workflowCls.fromSubworkflow(unit);
            break;
        default:
            throw new Error(`workflow type=${type} not understood.`);
    }
    return wf;
}
/**
 * @summary Combine workflow units together
 * @param workflow {*} the workflow object
 * @param unit {*} workflow/subworkflow object
 * @param config {*} additional configuration for e.g. map units
 * @param type {String} value in ["workflow", "subworkflow"]
 * @param unitFactoryCls {*} unit factory class for e.g. map units
 * @returns {*} modified workflow
 */
function composeWorkflow({ workflow, unit, config, type, unitFactoryCls }) {
    /* eslint-disable no-case-declarations */
    switch (type) {
        case "workflow":
            const { mapUnit: isMapUnit, ...mapUnitConfig } = config;
            if (isMapUnit) {
                const mapUnit = createMapUnit({ config: mapUnitConfig, unitFactoryCls });
                workflow.addMapUnit(mapUnit, unit);
            }
            else {
                console.log("adding workflows directly to workflows is not supported.");
            }
            break;
        case "subworkflow":
            workflow.addSubworkflow(unit);
            break;
        default:
            throw new Error(`workflow type=${type} not understood.`);
    }
    /* eslint-enable no-case-declarations */
    return workflow;
}
/**
 * @summary Convert a flattened array of workflow units to a properly constructed workflow
 * @param wfUnits {Array} array of workflow units
 * @param workflowCls {*} workflow class
 * @param unitFactoryCls {*} unit factory class
 * @returns {*} constructed workflow
 */
function createFromWorkflowUnits({ wfUnits, workflowCls, unitFactoryCls }) {
    let workflow, unit, config, type;
    wfUnits.map((wfUnit) => {
        ({ unit, config, type } = wfUnit);
        if (!workflow) {
            workflow = createWorkflowHead({
                workflow,
                unit,
                type,
                workflowCls,
            });
        }
        else {
            workflow = composeWorkflow({
                workflow,
                unit,
                config,
                type,
                unitFactoryCls,
            });
        }
        return null;
    });
    return (0, utils_1.applyConfig)({ obj: workflow, config });
}
/**
 * @summary Creates a flattened array of workflow units from nested workflow/subworkflow
 * configuration data comprising a simple or complex workflow
 * @param appName
 * @param units
 * @param swArgs
 * @returns {*[]}
 */
function createWorkflowUnits({ appName, workflowData, workflowSubworkflowMapByApplication, workflowCls, cache = [], ...swArgs }) {
    const wfUnits = [];
    const { units } = workflowData;
    let unit, config;
    units.map((unitData) => {
        const { type } = unitData;
        switch (type) {
            case "workflow":
                ({ config } = unitData);
                unit = createWorkflowUnits({
                    appName,
                    workflowData: unitData,
                    workflowSubworkflowMapByApplication,
                    workflowCls,
                    ...swArgs,
                });
                break;
            case "subworkflow":
                ({ config } = workflowData);
                unit = createSubworkflowUnit({
                    appName,
                    unitData,
                    workflowData: workflowSubworkflowMapByApplication,
                    cache,
                    ...swArgs,
                });
                break;
            default:
                break;
        }
        wfUnits.push({ config, unit, type });
        return null;
    });
    return createFromWorkflowUnits({
        wfUnits,
        workflowCls,
        subworkflowCls: swArgs.subworkflowCls,
        unitFactoryCls: swArgs.unitFactoryCls,
    });
}
function createWorkflow({ appName, workflowData, workflowSubworkflowMapByApplication, workflowCls = workflow_1.Workflow, ...swArgs }) {
    const cache = [];
    const { name } = workflowData;
    console.log(`wode: creating ${appName} workflow ${name}`);
    const wf = createWorkflowUnits({
        appName,
        workflowData,
        workflowSubworkflowMapByApplication,
        workflowCls,
        cache,
        ...swArgs,
    });
    wf.setName(name);
    wf.applicationName = appName;
    return wf;
}
