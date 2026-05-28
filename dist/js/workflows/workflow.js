"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workflow = void 0;
/* eslint-disable max-classes-per-file */
const entity_1 = require("@mat3ra/code/dist/js/entity");
const workflow_json_1 = __importDefault(require("@mat3ra/esse/dist/js/schema/workflow.json"));
const ide_1 = require("@mat3ra/ide");
const mode_1 = require("@mat3ra/mode");
const utils_1 = require("@mat3ra/utils");
const lodash_1 = __importDefault(require("lodash"));
const mixwith_1 = require("mixwith");
const underscore_1 = __importDefault(require("underscore"));
const underscore_string_1 = __importDefault(require("underscore.string"));
const enums_1 = require("../enums");
const subworkflow_1 = require("../subworkflows/subworkflow");
const units_1 = require("../units");
const factory_1 = require("../units/factory");
const utils_2 = require("../utils");
const default_1 = __importDefault(require("./default"));
const relaxation_1 = require("./relaxation");
const { MODEL_NAMES } = mode_1.tree;
class BaseWorkflow extends (0, mixwith_1.mix)(entity_1.NamedDefaultableRepetitionContextAndRenderInMemoryEntity).with(ide_1.ComputedEntityMixin, relaxation_1.RelaxationLogicMixin) {
}
class Workflow extends BaseWorkflow {
    constructor(config, _Subworkflow = subworkflow_1.Subworkflow, _UnitFactory = factory_1.UnitFactory, _Workflow = Workflow, _MapUnit = units_1.MapUnit) {
        if (!config._id) {
            config._id = Workflow.generateWorkflowId(config.name, config.properties, config.subworkflows, config.applicationName);
        }
        super(config);
        this._Subworkflow = _Subworkflow;
        this._UnitFactory = _UnitFactory;
        this._Workflow = _Workflow;
        this._MapUnit = _MapUnit;
        if (!config.skipInitialize)
            this.initialize();
    }
    initialize() {
        const me = this;
        this._subworkflows = this.prop("subworkflows").map((x) => new me._Subworkflow(x));
        this._units = this.prop("units").map((unit) => me._UnitFactory.create(unit));
        this._json.workflows = this._json.workflows || [];
        this._workflows = this.prop("workflows").map((x) => new me._Workflow(x));
    }
    static get defaultConfig() {
        return default_1.default;
    }
    static generateWorkflowId(name, properties = null, subworkflows = null, applicationName = null) {
        const propsInfo = (properties === null || properties === void 0 ? void 0 : properties.length) ? properties.sort().join(",") : "";
        const swInfo = (subworkflows === null || subworkflows === void 0 ? void 0 : subworkflows.length)
            ? subworkflows.map((sw) => sw.name || "unknown").join(",")
            : "";
        const seed = [`workflow-${name}`, applicationName, propsInfo, swInfo]
            .filter((p) => p)
            .join("-");
        if (this.usePredefinedIds)
            return utils_1.Utils.uuid.getUUIDFromNamespace(seed);
        return utils_1.Utils.uuid.getUUID();
    }
    static fromSubworkflow(subworkflow, ClsConstructor = Workflow) {
        const config = {
            name: subworkflow.name,
            subworkflows: [subworkflow.toJSON()],
            units: (0, utils_2.setNextLinks)((0, utils_2.setUnitsHead)([subworkflow.getAsUnit().toJSON()])),
            properties: subworkflow.properties,
            applicationName: subworkflow.application.name,
        };
        return new ClsConstructor(config);
    }
    static fromSubworkflows(name, ClsConstructor = Workflow, ...subworkflows) {
        return new ClsConstructor(name, subworkflows, subworkflows.map((sw) => sw.getAsUnit()));
    }
    /**
     * @summary Adds subworkflow to current workflow.
     * @param subworkflow {Subworkflow}
     * @param head {Boolean}
     */
    addSubworkflow(subworkflow, head = false, index = -1) {
        const subworkflowUnit = subworkflow.getAsUnit();
        if (head) {
            this.subworkflows.unshift(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        }
        else {
            this.subworkflows.push(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        }
    }
    removeSubworkflow(id) {
        const subworkflowUnit = this.units.find((u) => u.id === id);
        if (subworkflowUnit)
            this.removeUnit(subworkflowUnit.flowchartId);
    }
    subworkflowId(index) {
        const sw = this.prop(`subworkflows[${index}]`);
        return sw ? sw._id : null;
    }
    replaceSubworkflowAtIndex(index, newSubworkflow) {
        this._subworkflows[index] = newSubworkflow;
        this.setUnits((0, utils_2.setNextLinks)((0, utils_2.setUnitsHead)(this._units)));
    }
    get units() {
        return this._units;
    }
    setUnits(arr) {
        this._units = arr;
    }
    // returns a list of `app` Classes
    get usedApplications() {
        const swApplications = this.subworkflows.map((sw) => sw.application);
        const wfApplications = lodash_1.default.flatten(this.workflows.map((w) => w.usedApplications));
        return lodash_1.default.uniqBy(swApplications.concat(wfApplications), (a) => a.name);
    }
    // return application names
    get usedApplicationNames() {
        return this.usedApplications.map((a) => a.name);
    }
    get usedApplicationVersions() {
        return this.usedApplications.map((a) => a.version);
    }
    get usedApplicationNamesWithVersions() {
        return this.usedApplications.map((a) => `${a.name} ${a.version}`);
    }
    get usedModels() {
        return lodash_1.default.uniq(this.subworkflows.map((sw) => sw.model.type));
    }
    get humanReadableUsedModels() {
        return this.usedModels.filter((m) => m !== "unknown").map((m) => MODEL_NAMES[m]);
    }
    toJSON(exclude = []) {
        return lodash_1.default.omit({
            ...super.toJSON(),
            units: this._units.map((x) => x.toJSON()),
            subworkflows: this._subworkflows.map((x) => x.toJSON()),
            workflows: this.workflows.map((x) => x.toJSON()),
            ...(this.compute ? { compute: this.compute } : {}), // {"compute": null } won't pass esse validation
        }, exclude);
    }
    get isDefault() {
        return this.prop("isDefault", false);
    }
    get isMultiMaterial() {
        const fromSubworkflows = this.subworkflows.some((sw) => sw.isMultiMaterial);
        return this.prop("isMultiMaterial") || fromSubworkflows;
    }
    set isMultiMaterial(value) {
        this.setProp("isMultiMaterial", value);
    }
    set isUsingDataset(value) {
        this.setProp("isUsingDataset", value);
    }
    get isUsingDataset() {
        return !!this.prop("isUsingDataset", false);
    }
    get properties() {
        return lodash_1.default.uniq(lodash_1.default.flatten(this._subworkflows.map((x) => x.properties)));
    }
    get humanReadableProperties() {
        return this.properties.map((name) => underscore_string_1.default.humanize(name));
    }
    get systemName() {
        return underscore_string_1.default.slugify(`${this.usedApplicationNames.join(":")}-${this.name.toLowerCase()}`);
    }
    get defaultDescription() {
        return `${this.usedModels
            .join(", ")
            .toUpperCase()} workflow using ${this.usedApplicationNames.join(", ")}.`;
    }
    get exabyteId() {
        return this.prop("exabyteId");
    }
    get hash() {
        return this.prop("hash", "");
    }
    get isOutdated() {
        return this.prop("isOutdated", false);
    }
    get history() {
        return this.prop("history", []);
    }
    setMethodData(methodData) {
        this.subworkflows.forEach((sw) => {
            const method = methodData.getMethodBySubworkflow(sw);
            if (method)
                sw.model.setMethod(method);
        });
        this.workflows.forEach((wf) => {
            wf.subworkflows.forEach((sw) => {
                const method = methodData.getMethodBySubworkflow(sw);
                if (method)
                    sw.model.setMethod(method);
            });
        });
    }
    /**
     * @param unit {Unit}
     * @param head {Boolean}
     * @param index {Number}
     */
    addUnit(unit, head = false, index = -1) {
        const { units } = this;
        if (units.length === 0) {
            unit.head = true;
            this.setUnits([unit]);
        }
        else {
            if (head) {
                units.unshift(unit);
            }
            else if (index >= 0) {
                units.splice(index, 0, unit);
            }
            else {
                units.push(unit);
            }
            this.setUnits((0, utils_2.setNextLinks)((0, utils_2.setUnitsHead)(units)));
        }
    }
    removeUnit(flowchartId) {
        if (this.units.length < 2)
            return;
        const unit = this.units.find((x) => x.flowchartId === flowchartId);
        const previousUnit = this.units.find((x) => x.next === unit.flowchartId);
        if (previousUnit) {
            delete previousUnit.next;
        }
        this._subworkflows = this._subworkflows.filter((x) => x.id !== unit.id);
        this._units = (0, utils_2.setNextLinks)((0, utils_2.setUnitsHead)(this._units.filter((x) => x.flowchartId !== flowchartId)));
    }
    /**
     * @return Subworkflow[]
     */
    get subworkflows() {
        return this._subworkflows;
    }
    get workflows() {
        return this._workflows;
    }
    /*
     * @param type {String|Object} Unit type, map or subworkflow
     * @param head {Boolean}
     * @param index {Number} Index at which the unit will be added. -1 by default (ignored).
     */
    addUnitType(type, head = false, index = -1) {
        switch (type) {
            case enums_1.UNIT_TYPES.map:
                // eslint-disable-next-line no-case-declarations
                const workflowConfig = default_1.default;
                // eslint-disable-next-line no-case-declarations
                const mapUnit = new this._MapUnit();
                workflowConfig._id = this._Workflow.generateWorkflowId(workflowConfig.name, workflowConfig.properties, workflowConfig.subworkflows, this.applicationName);
                this.prop("workflows").push(workflowConfig);
                this._workflows = this.prop("workflows").map((x) => new this._Workflow(x));
                mapUnit.setWorkflowId(workflowConfig._id);
                this.addUnit(mapUnit, head, index);
                break;
            case enums_1.UNIT_TYPES.subworkflow:
                this.addSubworkflow(this._Subworkflow.createDefault(), head, index);
                break;
            default:
                console.log(`unit_type=${type} unrecognized, skipping.`);
        }
    }
    addMapUnit(mapUnit, mapWorkflow) {
        const mapWorkflowConfig = mapWorkflow.toJSON();
        if (!mapWorkflowConfig._id) {
            mapWorkflowConfig._id = this._Workflow.generateWorkflowId(mapWorkflowConfig.name, mapWorkflowConfig.properties, mapWorkflowConfig.subworkflows, mapWorkflow.applicationName || this.applicationName);
        }
        mapUnit.setWorkflowId(mapWorkflowConfig._id);
        this.addUnit(mapUnit);
        this._json.workflows.push(mapWorkflowConfig);
        const me = this;
        this._workflows = this.prop("workflows").map((x) => new me._Workflow(x));
    }
    findSubworkflowById(id) {
        if (!id)
            return;
        const workflows = this.workflows || [];
        const subworkflows = this.subworkflows || [];
        const subworkflow = subworkflows.find((sw) => sw.id === id);
        if (subworkflow)
            return subworkflow;
        const workflow = workflows.find((w) => w.findSubworkflowById(id));
        if (workflow)
            return workflow.findSubworkflowById(id);
        console.warn("attempted to find a non-existing subworkflow");
    }
    get allSubworkflows() {
        const subworkflowsList = [];
        this.subworkflows.forEach((sw) => subworkflowsList.push(sw));
        this.workflows.forEach((workflow) => {
            return Array.prototype.push.apply(subworkflowsList, workflow.allSubworkflows);
        });
        return subworkflowsList;
    }
    /**
     * @summary Calculates hash of the workflow. Meaningful fields are units and subworkflows.
     * units and subworkflows must be sorted topologically before hashing (already sorted).
     */
    calculateHash() {
        const meaningfulFields = {
            units: underscore_1.default.map(this.units, (u) => u.calculateHash()).join(),
            subworkflows: underscore_1.default.map(this.subworkflows, (sw) => sw.calculateHash()).join(),
            workflows: underscore_1.default.map(this.workflows, (w) => w.calculateHash()).join(),
        };
        return utils_1.Utils.hash.calculateHashFromObject(meaningfulFields);
    }
}
exports.Workflow = Workflow;
Workflow.getDefaultComputeConfig = ide_1.getDefaultComputeConfig;
Workflow.jsonSchema = workflow_json_1.default;
Workflow.usePredefinedIds = false;
