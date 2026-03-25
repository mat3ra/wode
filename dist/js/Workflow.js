"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workflow = void 0;
const entity_1 = require("@mat3ra/code/dist/js/entity");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const mode_1 = require("@mat3ra/mode");
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const slugify_1 = __importDefault(require("slugify"));
const enums_1 = require("./enums");
const WorkflowSchemaMixin_1 = require("./generated/WorkflowSchemaMixin");
const Subworkflow_1 = __importDefault(require("./Subworkflow"));
const units_1 = require("./units");
const factory_1 = require("./units/factory");
const default_1 = __importDefault(require("./workflows/default"));
const { MODEL_NAMES } = mode_1.tree;
class Workflow extends entity_1.InMemoryEntity {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow");
    }
    setTotalRepetitions(totalRepetition) {
        this.totalRepetitions = totalRepetition;
    }
    setRepetition(repetition) {
        this.repetition = repetition;
        this.unitInstances.forEach((u) => u.setRepetition(repetition));
        this.subworkflowInstances.forEach((sw) => sw.setRepetition(repetition));
        this.workflowInstances.forEach((wf) => wf.setRepetition(repetition));
    }
    static fromSubworkflow(subworkflow) {
        const config = {
            name: subworkflow.name,
            subworkflows: [subworkflow.toJSON()],
            units: [subworkflow.getAsUnit().toJSON()],
            properties: subworkflow.properties,
            applicationName: subworkflow.application.name,
            workflows: [],
        };
        return new this(config);
    }
    constructor(config) {
        var _a;
        super({
            ...config,
            _id: config._id || utils_1.Utils.uuid.getUUID(),
        });
        this.repetition = 0;
        this.totalRepetitions = 1;
        this.subworkflowInstances = this.subworkflows.map((x) => new Subworkflow_1.default(x));
        this.workflowInstances = ((_a = this.workflows) === null || _a === void 0 ? void 0 : _a.map((x) => new Workflow(x))) || [];
        this.setUnits(this.units.map((unit) => factory_1.UnitFactory.createInWorkflow(unit)));
    }
    get workflows() {
        return this.requiredProp("workflows");
    }
    set workflows(value) {
        this.setProp("workflows", value);
    }
    addSubworkflow(subworkflow, head = false, index = -1) {
        const subworkflowUnit = subworkflow.getAsUnit();
        if (head) {
            this.subworkflowInstances.unshift(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        }
        else {
            this.subworkflowInstances.push(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        }
    }
    removeSubworkflow(id) {
        const subworkflowUnit = this.unitInstances.find((u) => u.id === id);
        if (subworkflowUnit) {
            this.removeUnit(subworkflowUnit.flowchartId);
        }
    }
    setUnits(arr) {
        this.unitInstances = (0, standata_1.setUnitLinks)(arr);
    }
    render(context) {
        this.subworkflowInstances.forEach((sw) => {
            sw.render({
                ...context,
                workflow: this,
            });
        });
    }
    get usedApplications() {
        const swApplications = this.subworkflows.map((sw) => sw.application);
        const wfApplications = this.workflowInstances.map((w) => w.usedApplications).flat();
        const usedApplications = [...swApplications, ...wfApplications].reduce((acc, app) => {
            if (!acc.some((a) => a.name === app.name)) {
                acc.push(app);
            }
            return acc;
        }, []);
        return usedApplications;
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
        return Array.from(new Set(this.subworkflows.map((sw) => sw.model.type)));
    }
    get humanReadableUsedModels() {
        return this.usedModels.filter((m) => m !== "unknown").map((m) => MODEL_NAMES[m]);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            name: this.name,
            properties: this.properties,
            units: this.unitInstances.map((x) => x.toJSON()),
            subworkflows: this.subworkflowInstances.map((x) => x.toJSON()),
            workflows: this.workflowInstances.map((x) => x.toJSON()),
        };
    }
    get properties() {
        return [...new Set(this.subworkflows.map((x) => x.properties || []).flat())];
    }
    get humanReadableProperties() {
        return this.properties.map((name) => name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" "));
    }
    get systemName() {
        const applicationNames = this.usedApplications.map((a) => a.name);
        return (0, slugify_1.default)(`${applicationNames.join(":")}-${this.name.toLowerCase()}`);
    }
    get defaultDescription() {
        return `${this.usedModels.join(", ").toUpperCase()} workflow using ${this.usedApplications
            .map((a) => a.name)
            .join(", ")}.`;
    }
    addUnit(unit, head = false, index = -1) {
        const [...unitInstances] = this.unitInstances;
        if (unitInstances.length === 0) {
            this.setUnits([unit]);
        }
        else {
            if (head) {
                unitInstances.unshift(unit);
            }
            else if (index >= 0) {
                unitInstances.splice(index, 0, unit);
            }
            else {
                unitInstances.push(unit);
            }
            this.setUnits(unitInstances);
        }
    }
    removeUnit(flowchartId) {
        if (this.units.length < 2) {
            return;
        }
        const unit = this.unitInstances.find((x) => x.flowchartId === flowchartId);
        if (!unit) {
            return;
        }
        const previousUnit = this.unitInstances.find((x) => x.next === unit.flowchartId);
        if (previousUnit) {
            delete previousUnit.next;
        }
        this.subworkflowInstances = this.subworkflowInstances.filter((x) => x.id !== unit.id);
        this.setUnits(this.unitInstances.filter((x) => x.flowchartId !== flowchartId));
    }
    /*
     * @param type {String|Object} Unit type, map or subworkflow
     * @param head {Boolean}
     * @param index {Number} Index at which the unit will be added. -1 by default (ignored).
     */
    addUnitType(type, head = false, index = -1) {
        switch (type) {
            case enums_1.UnitType.map: {
                const mapWorkflowConfig = {
                    ...default_1.default,
                    _id: utils_1.Utils.uuid.getUUID(),
                };
                const mapUnit = new units_1.MapUnit({
                    workflowId: mapWorkflowConfig._id,
                });
                this.workflows = [...(this.workflows || []), mapWorkflowConfig];
                this.workflowInstances = this.workflows.map((x) => new Workflow(x));
                this.addUnit(mapUnit, head, index);
                break;
            }
            case enums_1.UnitType.subworkflow:
                this.addSubworkflow(Subworkflow_1.default.createDefault(), head, index);
                break;
            default:
                console.log(`unit_type=${type} unrecognized, skipping.`);
        }
    }
    addMapUnit(mapUnit, mapWorkflow) {
        const mapWorkflowConfig = {
            _id: utils_1.Utils.uuid.getUUID(),
            ...mapWorkflow.toJSON(),
        };
        mapUnit.setWorkflowId(mapWorkflowConfig._id);
        this.addUnit(mapUnit);
        this.workflows = [...(this.workflows || []), mapWorkflowConfig];
        this.workflowInstances = this.workflows.map((x) => new Workflow(x));
    }
    get allSubworkflows() {
        const subworkflowsList = [];
        this.subworkflowInstances.forEach((sw) => subworkflowsList.push(sw));
        this.workflowInstances.forEach((workflow) => {
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
            units: this.unitInstances.map((u) => u.calculateHash()).join(),
            subworkflows: this.subworkflowInstances.map((sw) => sw.calculateHash()).join(),
            workflows: this.workflowInstances.map((w) => w.calculateHash()).join(),
        };
        return utils_1.Utils.hash.calculateHashFromObject(meaningfulFields);
    }
    get hasRelaxation() {
        return Boolean(this.getRelaxationSubworkflow());
    }
    toggleRelaxation() {
        const relaxSubworkflow = this.getRelaxationSubworkflow();
        if (relaxSubworkflow === null || relaxSubworkflow === void 0 ? void 0 : relaxSubworkflow._id) {
            this.removeSubworkflow(relaxSubworkflow._id);
        }
        else {
            const vcRelax = this.getStandataRelaxationSubworkflow();
            if (vcRelax) {
                this.addSubworkflow(new Subworkflow_1.default(vcRelax), true);
            }
        }
    }
    getStandataRelaxationSubworkflow() {
        // TODO: fix standata type
        return new standata_1.SubworkflowStandata().getRelaxationSubworkflowByApplication(this.subworkflowInstances[0].application.name);
    }
    getRelaxationSubworkflow() {
        const standataSubworkflow = this.getStandataRelaxationSubworkflow();
        return this.subworkflows.find((sw) => {
            return standataSubworkflow && standataSubworkflow.systemName === sw.systemName;
        });
    }
}
exports.Workflow = Workflow;
Workflow.defaultConfig = default_1.default;
(0, NamedEntityMixin_1.namedEntityMixin)(Workflow.prototype);
(0, DefaultableMixin_1.defaultableEntityMixin)(Workflow);
(0, WorkflowSchemaMixin_1.workflowSchemaMixin)(Workflow.prototype);
