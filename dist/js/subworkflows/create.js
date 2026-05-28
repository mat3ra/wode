"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnit = createUnit;
exports.createSubworkflow = createSubworkflow;
exports.createSubworkflowByName = createSubworkflowByName;
const ade_1 = require("@mat3ra/ade");
const mode_1 = require("@mat3ra/mode");
const standata_1 = require("@mat3ra/standata");
const lodash_1 = __importDefault(require("lodash"));
const units_1 = require("../units");
const builders_1 = require("../units/builders");
const utils_1 = require("../utils");
const dynamic_1 = require("./dynamic");
const subworkflow_1 = require("./subworkflow");
// NOTE: DFTModel => DFTModelConfig, configs should have the same name as the model/method class + "Config" at the end
function _getConfigFromModelOrMethodName(name, kind) {
    const configs = kind === "Model" ? mode_1.default_models : mode_1.default_methods;
    if (!configs[`${name}Config`]) {
        // eslint-disable-next-line no-param-reassign
        name = `Unknown${kind}`;
    }
    return configs[`${name}Config`];
}
/**
 * @summary Create model from subworkflow data
 * @param config {Object} model config
 * @param modelFactoryCls {any} model factory to use
 * @returns {DFTModel|Model}
 */
function createModel({ config, modelFactoryCls }) {
    const { name, config: modelConfig = {} } = config;
    const defaultConfig = _getConfigFromModelOrMethodName(name, "Model");
    return modelFactoryCls.create({ ...defaultConfig, ...modelConfig });
}
/**
 * @summary Create method from subworkflow data
 * @param config {Object} method configuration
 * @param methodFactoryCls {any}
 * @param applicationConfig {Object} application configuration
 * @returns {{method, setSearchText}}
 */
function createMethod({ config, methodFactoryCls, applicationConfig = {} }) {
    const { name, setSearchText = null, config: methodConfig = {} } = config;
    const defaultConfig = _getConfigFromModelOrMethodName(name, "Method");
    const defaultConfigForApp = new standata_1.ApplicationMethodStandata().getDefaultMethodConfigForApplication(applicationConfig);
    const defaultConfigForAppSimple = defaultConfigForApp && defaultConfigForApp.units
        ? mode_1.MethodConversionHandler.convertToSimple(defaultConfigForApp)
        : defaultConfigForApp;
    const method = methodFactoryCls.create({
        ...defaultConfig,
        ...defaultConfigForAppSimple,
        ...methodConfig,
    });
    return { method, setSearchText };
}
/**
 * @summary Create top-level objects used in subworkflow initialization
 * @param subworkflowData {Object} subworkflow data
 * @param AppRegistry
 * @param modelFactoryCls {any} model factory class
 * @param methodFactoryCls {any} method factory class
 * @returns {{application: *, method: *, model: (DFTModel|Model), setSearchText: String|null}}
 */
function createTopLevel({ subworkflowData, modelFactoryCls, methodFactoryCls, AppRegistry }) {
    const { application: appConfig, model: modelConfig, method: methodConfig } = subworkflowData;
    const application = AppRegistry.createApplication(appConfig);
    const model = createModel({ config: modelConfig, modelFactoryCls });
    const { method, setSearchText } = createMethod({
        config: methodConfig,
        methodFactoryCls,
        applicationConfig: appConfig,
    });
    return {
        application,
        model,
        method,
        setSearchText,
    };
}
/**
 * @summary Create workflow unit from JSON configuration
 *      Supports applying functions to the builder prior to building via "functions"
 *      Supports applying attributes to the builder after building via "attributes"
 * @param config {Object} unit config
 * @param application {*} application
 * @param unitBuilders {Object} workflow unit builders
 * @param unitFactoryCls {*} workflow unit class factory
 * @returns {*|{head: boolean, preProcessors: [], postProcessors: [], name: *, flowchartId: *, type: *, results: [], monitors: []}}
 */
function createUnit({ config, application, unitBuilders, unitFactoryCls, cache = [] }) {
    const { type, config: unitConfig } = config;
    if (type === "executionBuilder") {
        const { name, execName, flavorName, flowchartId } = unitConfig;
        const builder = new unitBuilders.ExecutionUnitConfigBuilder(name, application, execName, flavorName, flowchartId, cache);
        // config should contain "functions" and "attributes"
        const cfg = (0, utils_1.applyConfig)({ obj: builder, config, callBuild: true });
        return unitFactoryCls.create(cfg);
    }
    return unitFactoryCls.create({ type, ...unitConfig });
}
/**
 * @summary Dynamically create subworkflow units
 * @param dynamicSubworkflow {String} name of unit creation function
 * @param units {Array} configured units to provide to dynamic unit creation
 * @param unitBuilders {Object} unit configuration builders
 * @param unitFactoryCls {*} unit factory class
 * @param application {*} application (optional)
 * @returns {*}
 */
function createDynamicUnits({ dynamicSubworkflow, units, unitBuilders, unitFactoryCls, application = null, }) {
    const { name, subfolder } = dynamicSubworkflow;
    const func = subfolder && lodash_1.default.get(dynamic_1.dynamicSubworkflowsByApp, `${subfolder}.${name}`, () => { });
    switch (name) {
        case "surfaceEnergy":
            // eslint-disable-next-line no-case-declarations
            const [scfUnit] = units;
            return (0, dynamic_1.getSurfaceEnergySubworkflowUnits)({ scfUnit, unitBuilders });
        case "getQpointIrrep":
            return func({ unitBuilders, unitFactoryCls, application });
        default:
            throw new Error(`dynamicSubworkflow=${name} not recognized`);
    }
}
function createSubworkflow({ subworkflowData, cache = [], AppRegistry = ade_1.ApplicationRegistry, modelFactoryCls = mode_1.ModelFactory, methodFactoryCls = mode_1.MethodFactory, subworkflowCls = subworkflow_1.Subworkflow, unitFactoryCls = units_1.UnitFactory, unitBuilders = builders_1.builders, }) {
    const { application, model, method, setSearchText } = createTopLevel({
        subworkflowData,
        AppRegistry,
        modelFactoryCls,
        methodFactoryCls,
    });
    let units = [];
    const { name, units: unitConfigs, config = {}, dynamicSubworkflow = null } = subworkflowData;
    unitConfigs.forEach((_config) => {
        units.push(createUnit({
            config: _config,
            application,
            unitBuilders,
            unitFactoryCls,
            cache,
        }));
    });
    if (dynamicSubworkflow) {
        units = createDynamicUnits({
            dynamicSubworkflow,
            units,
            unitBuilders,
            unitFactoryCls,
            application,
        });
    }
    let subworkflow = subworkflowCls.fromArguments(application, model, method, name, units, config);
    const { functions = {}, attributes = {} } = config;
    subworkflow = (0, utils_1.applyConfig)({ obj: subworkflow, config: { functions, attributes } });
    if (setSearchText)
        subworkflow.model.Method.setSearchText(setSearchText);
    return subworkflow;
}
/**
 * @summary Convenience wrapper around createSubworkflow to create by app name and swf name
 * @param appName {String} application name
 * @param swfName {String} subworkflow name (snake_case.yml)
 * @param workflowSubworkflowMapByApplication {Object} object containing all workflow/subworkflow map by application
 * @param swArgs {Object} classes for instantiation
 * @returns {*} subworkflow object
 */
function createSubworkflowByName({ appName, swfName, workflowSubworkflowMapByApplication, ...swArgs }) {
    const { subworkflows } = workflowSubworkflowMapByApplication;
    const { [appName]: allSubworkflowData } = subworkflows;
    const { [swfName]: subworkflowData } = allSubworkflowData;
    return createSubworkflow({
        subworkflowData,
        ...swArgs,
    });
}
