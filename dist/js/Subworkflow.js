"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ade_1 = require("@mat3ra/ade");
const entity_1 = require("@mat3ra/code/dist/js/entity");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const mode_1 = require("@mat3ra/mode");
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const factory_1 = require("./convergence/factory");
const enums_1 = require("./enums");
const SubworkflowSchemaMixin_1 = require("./generated/SubworkflowSchemaMixin");
const units_1 = require("./units");
class Subworkflow extends entity_1.InMemoryEntity {
    constructor(config, _ModelFactory = mode_1.ModelFactory) {
        super(config);
        this.properties = [];
        this.ModelFactory = _ModelFactory;
        this.applicationInstance = new ade_1.Application(this.application);
        this.modelInstance = this.ModelFactory.create({
            ...this.model,
            application: this.application,
        });
        this.setUnits(this.units.map((cfg) => units_1.UnitFactory.createInSubworkflow(cfg)));
    }
    static get defaultConfig() {
        const defaultName = "New Subworkflow";
        return {
            _id: utils_1.Utils.uuid.getUUID(),
            name: defaultName,
            application: ade_1.Application.defaultConfig,
            model: mode_1.Model.defaultConfig,
            properties: [],
            units: [],
        };
    }
    getAsUnit() {
        return new units_1.SubworkflowUnit({
            type: enums_1.UnitType.subworkflow,
            _id: this.id,
            name: this.name,
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            results: [],
            flowchartId: "",
        });
    }
    setApplication(application) {
        // TODO: adjust the logic above to take into account whether units need re-rendering after version change etc.
        // reset units if application name changes
        const previousApplicationName = this.application.name;
        this.applicationInstance = application;
        if (previousApplicationName !== application.name) {
            // TODO: figure out how to set a default unit per new application instead of removing all
            this.setUnits([]);
        }
        else {
            // propagate new application version to all units
            this.unitsInstances
                .filter((unit) => unit.type === enums_1.UnitType.execution)
                .forEach((unit) => {
                unit.setApplication({ application });
            });
        }
        this.application = application.toJSON();
        // set model to the default one for the application selected
        this.setModel(this.ModelFactory.createFromApplication({
            application: this.application,
        }));
    }
    setModel(model) {
        this.modelInstance = model;
        this.model = model.toJSON();
    }
    buildExternalContext(context) {
        const subworkflowContext = this.units
            .filter((u) => u.type === enums_1.UnitType.assignment)
            .reduce((acc, u) => {
            return {
                ...acc,
                [u.operand]: u.value,
            };
        }, {});
        return {
            ...context,
            application: this.applicationInstance.toJSON(),
            methodData: this.model.method.data,
            subworkflowContext,
        };
    }
    render(context) {
        const ctx = this.buildExternalContext(context);
        this.unitsInstances.forEach((u) => {
            if (u.type === enums_1.UnitType.execution) {
                u.render(ctx);
            }
        });
    }
    /**
     * TODO: reuse workflow function instead
     */
    addUnit(unit, index = -1) {
        const { unitsInstances } = this;
        if (unitsInstances.length === 0) {
            this.setUnits([unit]);
        }
        else {
            if (index >= 0) {
                unitsInstances.splice(index, 0, unit);
            }
            else {
                unitsInstances.push(unit);
            }
            this.setUnits(unitsInstances);
        }
    }
    setUnits(units) {
        // TODO: remove the setNextLinks and setUnitsHead and handle the logic via flowchart designer
        this.unitsInstances = (0, standata_1.setUnitLinks)(units);
        this.units = units.map((x) => x.toJSON());
        this.properties = units.map((x) => x.resultNames).flat();
    }
    removeUnit(flowchartId) {
        const previousUnit = this.unitsInstances.find((x) => x.next === flowchartId);
        if (previousUnit) {
            previousUnit.unsetProp("next");
        }
        this.setUnits(this.unitsInstances.filter((x) => x.flowchartId !== flowchartId));
    }
    getUnit(flowchartId) {
        return this.unitsInstances.find((x) => x.flowchartId === flowchartId);
    }
    unitIndex(flowchartId) {
        return this.units.findIndex((unit) => {
            return unit.flowchartId === flowchartId;
        });
    }
    replaceUnit(index, unit) {
        this.unitsInstances[index] = unit;
        this.setUnits(this.unitsInstances);
    }
    setIsDraft(bool) {
        this.isDraft = bool;
    }
    get methodData() {
        return this.modelInstance.Method.data;
    }
    /**
     * @summary Calculates hash of the subworkflow. Meaningful fields are units, app and model.
     * units must be sorted topologically before hashing (already sorted).
     */
    calculateHash() {
        const config = this.toJSON();
        const meaningfulFields = {
            application: utils_1.Utils.specific.removeTimestampableKeysFromConfig(config.application),
            model: this.calculateModelHash(),
            units: this.unitsInstances.map((u) => u.calculateHash()).join(),
        };
        return utils_1.Utils.hash.calculateHashFromObject(meaningfulFields);
    }
    calculateModelHash() {
        const { model } = this.toJSON();
        // ignore empty data object
        if (this.modelInstance.Method.omitInHashCalculation) {
            delete model.method.data;
        }
        return utils_1.Utils.hash.calculateHashFromObject(model);
    }
    findUnitById(id) {
        // TODO: come back and refactor after converting flowchartId to id
        return this.units.find((u) => u.flowchartId === id);
    }
    findUnitKeyById(id) {
        const index = this.units.findIndex((u) => u.flowchartId === id);
        return `units.${index}`;
    }
    findUnitWithTag(tag) {
        return this.units
            .filter((unit) => unit.type === enums_1.UnitType.assignment)
            .find((unit) => { var _a; return (_a = unit.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); });
    }
    get hasConvergence() {
        return !!this.convergenceParam && !!this.convergenceResult;
    }
    get convergenceParam() {
        var _a;
        return (_a = this.findUnitWithTag(enums_1.UnitTag.hasConvergenceParam)) === null || _a === void 0 ? void 0 : _a.operand;
    }
    get convergenceResult() {
        var _a;
        return (_a = this.findUnitWithTag(enums_1.UnitTag.hasConvergenceResult)) === null || _a === void 0 ? void 0 : _a.operand;
    }
    convergenceSeries(scopeTrack) {
        if (!this.hasConvergence || !(scopeTrack === null || scopeTrack === void 0 ? void 0 : scopeTrack.length)) {
            return [];
        }
        let prevResult;
        return scopeTrack
            .map((scopeItem, i) => {
            var _a, _b;
            return {
                x: i,
                // TODO: fix types
                // @ts-ignore
                param: (_a = scopeItem.scope) === null || _a === void 0 ? void 0 : _a.global[this.convergenceParam],
                // @ts-ignore
                y: (_b = scopeItem.scope) === null || _b === void 0 ? void 0 : _b.global[this.convergenceResult],
            };
        })
            .filter(({ y }) => {
            const changed = prevResult !== y;
            prevResult = y;
            return changed;
        })
            .map((item, i) => {
            return {
                x: i + 1,
                param: item.param,
                y: item.y,
            };
        });
    }
    addConvergence({ parameter, parameterInitial, parameterIncrement, result, resultInitial, condition, operator, tolerance, maxOccurrences, externalContext, }) {
        // Find unit to converge: should contain passed result in its results list
        // TODO: make user to select unit for convergence explicitly
        const unitForConvergence = this.unitsInstances
            .filter((x) => x.type === enums_1.UnitType.execution)
            .find((x) => {
            return x.resultNames.find((name) => name === result);
        });
        if (!unitForConvergence) {
            throw new Error(`Subworkflow does not contain unit with '${result}' as extracted property.`);
        }
        // initialize parameter
        const convergenceParameter = (0, factory_1.createConvergenceParameter)({
            name: parameter,
            initialValue: parameterInitial,
            increment: parameterIncrement,
        });
        const context = this.buildExternalContext(externalContext);
        unitForConvergence.addConvergenceContext(convergenceParameter, context);
        const prevResult = "prev_result";
        const iteration = "iteration";
        // Assignment with result's initial value
        const prevResultInit = new units_1.AssignmentUnit({
            name: "init result",
            head: true,
            operand: prevResult,
            value: resultInitial,
        });
        // Assignment with initial value of convergence parameter
        const paramInit = new units_1.AssignmentUnit({
            name: "init parameter",
            operand: convergenceParameter.name,
            value: convergenceParameter.initialValue,
            tags: [enums_1.UnitTag.hasConvergenceParam],
        });
        // Assignment with initial value of iteration counter
        const iterInit = new units_1.AssignmentUnit({
            name: "init counter",
            operand: iteration,
            value: 1,
        });
        // Assignment for storing iteration result: extracts 'result' from convergence unit scope
        const storePrevResult = new units_1.AssignmentUnit({
            name: "store result",
            input: [
                {
                    scope: unitForConvergence.flowchartId,
                    name: result,
                },
            ],
            operand: prevResult,
            value: result,
        });
        // Assignment for convergence param increase
        const nextStep = new units_1.AssignmentUnit({
            name: "update parameter",
            input: convergenceParameter.useVariablesFromUnitContext(unitForConvergence.flowchartId),
            operand: convergenceParameter.name,
            value: convergenceParameter.increment,
            next: unitForConvergence.flowchartId,
        });
        // Final step of convergence
        const exit = new units_1.AssignmentUnit({
            name: "exit",
            input: [],
            operand: convergenceParameter.name,
            value: convergenceParameter.finalValue,
        });
        // Final step of convergence
        const storeResult = new units_1.AssignmentUnit({
            name: "update result",
            input: [
                {
                    scope: unitForConvergence.flowchartId,
                    name: result,
                },
            ],
            operand: result,
            value: result,
            tags: [enums_1.UnitTag.hasConvergenceResult],
        });
        // Assign next iteration value
        const nextIter = new units_1.AssignmentUnit({
            name: "update counter",
            input: [],
            operand: iteration,
            value: `${iteration} + 1`,
        });
        // Convergence condition unit
        const conditionUnit = new units_1.ConditionUnit({
            name: "check convergence",
            statement: `${condition} ${operator} ${tolerance}`,
            then: exit.flowchartId,
            else: storePrevResult.flowchartId,
            maxOccurrences,
            next: storePrevResult.flowchartId,
        });
        this.addUnit(paramInit, 0);
        this.addUnit(prevResultInit, 1);
        this.addUnit(iterInit, 2);
        this.addUnit(storeResult);
        this.addUnit(conditionUnit);
        this.addUnit(storePrevResult);
        this.addUnit(nextIter);
        this.addUnit(nextStep);
        this.addUnit(exit);
        // `addUnit` adjusts the `next` field, hence the below.
        nextStep.next = unitForConvergence.flowchartId;
    }
}
exports.default = Subworkflow;
(0, NamedEntityMixin_1.namedEntityMixin)(Subworkflow.prototype);
(0, DefaultableMixin_1.defaultableEntityMixin)(Subworkflow);
(0, SubworkflowSchemaMixin_1.subworkflowSchemaMixin)(Subworkflow.prototype);
