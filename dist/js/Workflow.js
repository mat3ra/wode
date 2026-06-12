"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@mat3ra/code/dist/js/entity");
const in_memory_1 = require("@mat3ra/code/dist/js/entity/in_memory");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const HasDescriptionMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HasDescriptionMixin");
const HashedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const TaggableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/TaggableMixin");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const compute_1 = require("@mat3ra/ide/dist/js/compute");
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("./enums");
const WorkflowSchemaMixin_1 = require("./generated/WorkflowSchemaMixin");
const Subworkflow_1 = __importDefault(require("./Subworkflow"));
const units_1 = require("./units");
const factory_1 = require("./units/factory");
const workflow_1 = require("./utils/workflow");
const default_1 = __importDefault(require("./workflows/default"));
class Workflow extends entity_1.InMemoryEntity {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow");
    }
    static getSubworkflowValidationError(subworkflow) {
        // Two checks, same order as the old isValid() path (construct + validate), but split so we
        // keep AJV errors when hydration would fail first:
        // 1. validateData — JSON Schema on raw persisted subworkflow (no Application/ModelFactory/units).
        //    Surfaces structured AJV errors (e.g. missing model) before the constructor runs.
        // 2. new Subworkflow().validate() — hydration (app, model, units) then schema on the instance.
        //    Catches schema-valid JSON that still cannot be built (unknown model, bad units, etc.).
        try {
            Subworkflow_1.default.validateData({ ...subworkflow });
            new Subworkflow_1.default(subworkflow).validate();
            return null;
        }
        catch (error) {
            if (error instanceof in_memory_1.EntityError || error instanceof Error) {
                return error;
            }
            return new Error(String(error));
        }
    }
    static repair(workflowData) {
        const subworkflows = workflowData.subworkflows.map((subworkflow) => {
            return Subworkflow_1.default.repair(subworkflow);
        });
        const invalidSubworkflows = subworkflows
            .map((subworkflow) => {
            const error = Workflow.getSubworkflowValidationError(subworkflow);
            return error ? { subworkflow, error } : null;
        })
            .filter((entry) => entry !== null);
        const units = workflowData.units.map((unit) => {
            const invalidEntry = invalidSubworkflows.find(({ subworkflow }) => subworkflow._id === unit._id);
            if (invalidEntry) {
                const { subworkflow, error } = invalidEntry;
                const errorUnit = units_1.BaseUnit.toErrorUnitSchema(unit, error);
                const reasonPayload = {
                    ...JSON.parse(errorUnit.reason),
                    json: { unit, subworkflow },
                };
                return {
                    ...errorUnit,
                    _id: unit._id,
                    name: unit.name || errorUnit.name,
                    flowchartId: unit.flowchartId,
                    reason: JSON.stringify(reasonPayload),
                    preProcessors: unit.preProcessors || [],
                    postProcessors: unit.postProcessors || [],
                    monitors: unit.monitors || [],
                    results: unit.results || [],
                };
            }
            return unit;
        });
        const validSubworkflows = subworkflows.filter((subworkflow) => {
            return !invalidSubworkflows.some(({ subworkflow: invalid }) => invalid._id === subworkflow._id);
        });
        const workflows = workflowData.workflows.map((nested) => {
            return Workflow.repair(nested);
        });
        return {
            ...workflowData,
            subworkflows: validSubworkflows,
            workflows,
            units,
        };
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
    updateMethodData(materials, metaProperties) {
        this.subworkflowInstances.forEach((sw) => {
            sw.updateMethodData(materials, metaProperties);
        });
    }
    removeSubworkflow(id) {
        const subworkflowUnit = this.unitInstances.find((u) => u.id === id);
        if (subworkflowUnit) {
            this.removeUnit(subworkflowUnit.flowchartId);
        }
    }
    setUnits(arr) {
        this.unitInstances = (0, standata_1.setUnitLinks)(arr);
        this.units = this.unitInstances.map((u) => u.toJSON());
    }
    /**
     * A top-level subworkflow branch is represented twice: a {@link UnitType.subworkflow} unit in
     * `unitInstances` (flowchart card) and a full {@link Subworkflow} in `subworkflowInstances`
     * (linked by the same `id` as {@link Subworkflow.getAsUnit}). Their display names must match
     * so `toJSON()` and editors stay consistent. Call this after mutating a subworkflow unit's
     * `name` (and updating `unitInstances` via {@link setUnits}).
     */
    syncLinkedSubworkflowNameFromUnit(unit) {
        if (unit.type !== enums_1.UnitType.subworkflow)
            return;
        const linked = this.subworkflowInstances.find((s) => s.id === unit.id);
        linked === null || linked === void 0 ? void 0 : linked.setName(unit.name);
    }
    render(context) {
        this.subworkflowInstances.forEach((sw) => {
            sw.render({
                ...context,
                workflowHasRelaxation: this.hasRelaxation,
            });
        });
        this.workflowInstances.forEach((wf) => {
            wf.render(context);
        });
    }
    get usedApplications() {
        return (0, workflow_1.getUsedApplications)(this);
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
    getUsedModels() {
        return (0, workflow_1.getUsedModels)(this);
    }
    getHumanReadableUsedModels() {
        return (0, workflow_1.getHumanReadableUsedModels)(this);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            name: this.name,
            properties: (0, workflow_1.getProperties)(this),
            units: this.unitInstances.map((x) => x.toJSON()),
            subworkflows: this.subworkflowInstances.map((x) => x.toJSON()),
            workflows: this.workflowInstances.map((x) => x.toJSON()),
        };
    }
    getHumanReadableProperties() {
        return (0, workflow_1.getHumanReadableProperties)(this);
    }
    getProperties() {
        return (0, workflow_1.getProperties)(this);
    }
    getSystemName() {
        return (0, workflow_1.getSystemName)(this);
    }
    getDefaultDescription() {
        return (0, workflow_1.getDefaultDescription)(this);
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
    getHashObject() {
        return {
            units: this.unitInstances.map((u) => u.calculateHash()).join(),
            subworkflows: this.subworkflowInstances.map((sw) => sw.calculateHash()).join(),
            workflows: this.workflowInstances.map((w) => w.calculateHash()).join(),
        };
    }
    getStandataRelaxationSubworkflow() {
        // TODO: fix standata type
        const subworkflow = new standata_1.SubworkflowStandata().getRelaxationSubworkflowByApplication(this.subworkflowInstances[0].application.name);
        if (!subworkflow) {
            return undefined;
        }
        const executionUnit = subworkflow.units.find((unit) => unit.type === enums_1.UnitType.execution);
        if (!executionUnit) {
            throw new Error("Relaxation subworkflow is missing an execution unit");
        }
        return {
            ...subworkflow,
            application: executionUnit.application,
        };
    }
    getRelaxationSubworkflow() {
        const standataSubworkflow = this.getStandataRelaxationSubworkflow();
        return this.subworkflowInstances.find((sw) => {
            return standataSubworkflow && standataSubworkflow.systemName === sw.systemName;
        });
    }
}
Workflow.defaultConfig = default_1.default;
(0, NamedEntityMixin_1.namedEntityMixin)(Workflow.prototype);
(0, WorkflowSchemaMixin_1.workflowSchemaMixin)(Workflow.prototype);
(0, TaggableMixin_1.taggableMixin)(Workflow.prototype);
(0, compute_1.computedEntityMixin)(Workflow.prototype);
(0, DefaultableMixin_1.defaultableEntityMixin)(Workflow);
(0, HashedEntityMixin_1.hashedEntityMixin)(Workflow.prototype);
(0, HasDescriptionMixin_1.hasDescriptionMixin)(Workflow.prototype);
exports.default = Workflow;
