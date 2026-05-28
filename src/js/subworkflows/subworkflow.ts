import { Application } from "@mat3ra/ade";
import { ContextAndRenderFieldsMixin, InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import {
    type DefaultableInMemoryEntityConstructor,
    defaultableEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import {
    type NamedInMemoryEntityConstructor,
    namedEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { ApplicationSchema, BaseMethod, BaseModel } from "@mat3ra/esse/dist/js/types";
import { type Method, Model, ModelFactory } from "@mat3ra/mode";
import { Utils } from "@mat3ra/utils";
import lodash from "lodash";
import _ from "underscore";

import { UNIT_TYPES, UnitType } from "../enums";
import {
    type SubworkflowSchemaMixin,
    subworkflowSchemaMixin,
} from "../generated/SubworkflowSchemaMixin";
import { type BaseUnit, UnitFactory } from "../units";
import { setNextLinks, setUnitsHead } from "../utils";
import { ConvergenceMixin } from "./convergence";

/* eslint max-classes-per-file:0 */

// class BaseSubworkflow extends mix(NamedDefaultableRepetitionImportantSettingsInMemoryEntity).with(
//     ConvergenceMixin,
//     ContextAndRenderFieldsMixin,
// ) {}

type Base = typeof InMemoryEntity &
    DefaultableInMemoryEntityConstructor &
    NamedInMemoryEntityConstructor &
    Constructor<SubworkflowSchemaMixin>;

export class Subworkflow extends (InMemoryEntity as Base) {
    static usePredefinedIds = false;

    private ModelFactory: typeof ModelFactory;

    private UnitFactory: typeof UnitFactory;

    private applicationInstance: Application;

    private modelInstance: Model;

    private unitsInstances: BaseUnit[];

    constructor(
        config: SubworkflowSchemaMixin,
        _ModelFactory = ModelFactory,
        _UnitFactory = UnitFactory,
    ) {
        super(config);
        this.ModelFactory = _ModelFactory;
        this.UnitFactory = _UnitFactory;

        this.applicationInstance = new Application(this.application);
        this.modelInstance = this.ModelFactory.create({
            ...this.model,
            application: this.application,
        });
        this.unitsInstances = setNextLinks(
            setUnitsHead(this.units || []).map((cfg) => {
                return this.UnitFactory.create({ ...cfg, application: this.application });
            }),
        );
    }

    static generateSubworkflowId(
        name: string,
        application?: ApplicationSchema,
        model?: BaseModel,
        method?: BaseMethod,
    ) {
        const appName = application?.name || "";
        const modelInfo = model ? `${model.type}-${model.subtype || ""}` : "";
        const methodInfo = method ? `${method.type}-${method.subtype || ""}` : "";
        const seed = [`subworkflow-${name}`, appName, modelInfo, methodInfo]
            .filter((p) => p)
            .join("-");

        return this.usePredefinedIds ? Utils.uuid.getUUIDFromNamespace(seed) : Utils.uuid.getUUID();
    }

    static get defaultConfig() {
        const defaultName = "New Subworkflow";
        return {
            _id: this.generateSubworkflowId(defaultName),
            name: defaultName,
            application: Application.defaultConfig,
            model: Model.defaultConfig,
            properties: [],
            units: [],
        };
    }

    /*
     * @returns {SubworkflowUnit}
     */
    getAsUnit() {
        return this.UnitFactory.create({
            type: UnitType.subworkflow,
            _id: this.id,
            name: this.name,
        });
    }

    /*
     * @summary Used to generate initial application tree, therefore omit setting application.
     */
    static fromArguments(
        application: Application,
        model: Model,
        method: Method,
        name: string,
        units: BaseUnit[] = [],
        config = {},
        Cls = Subworkflow,
    ) {
        const nameForIdGeneration = config.attributes?.name || name;
        const { functions, attributes, ...cleanConfig } = config;

        // Set the method on the model so it can be properly serialized
        model.setMethod(method);

        return new Cls({
            ...cleanConfig,
            _id: Cls.generateSubworkflowId(nameForIdGeneration, application, model, method),
            name,
            application: application.toJSON(),
            properties: lodash.sortedUniq(
                lodash.flatten(units.filter((x) => x.resultNames).map((x) => x.resultNames)),
            ),
            model: {
                ...model.toJSON(),
                method: method.toJSON(),
            },
            units: units.map((unit) => (unit.toJSON ? unit.toJSON() : unit)),
        });
    }

    setApplication(application: Application) {
        // TODO: adjust the logic above to take into account whether units need re-rendering after version change etc.
        // reset units if application name changes
        const previousApplicationName = this.application.name;
        this.applicationInstance = application;

        if (previousApplicationName !== application.name) {
            // TODO: figure out how to set a default unit per new application instead of removing all
            this.setUnits([]);
        } else {
            // propagate new application version to all units
            this.units
                .filter((unit) => typeof unit.setApplication === "function")
                .forEach((unit) => unit.setApplication(this.applicationInstance, true));
        }

        this.application = application.toJSON();
        // set model to the default one for the application selected
        this.setModel(
            this.ModelFactory.createFromApplication({
                application: this.application,
            }),
        );
    }

    setModel(model: Model) {
        this.modelInstance = model;
    }

    setUnits(units: BaseUnit[]) {
        this.unitsInstances = units;
    }

    toJSON(exclude: string[] = []) {
        return {
            ...super.toJSON(exclude),
            model: this.modelInstance.toJSON(),
            units: this.unitsInstances.map((x) => x.toJSON()),
            ...(this.compute ? { compute: this.compute } : {}), // {"compute": null } won't pass esse validation
        };
    }

    get contextProviders() {
        const unitsWithContextProviders = this.units.filter(
            (u) => u.allContextProviders && u.allContextProviders.length,
        );
        const allContextProviders = _.flatten(
            unitsWithContextProviders.map((u) => u.allContextProviders),
        );
        const subworkflowContextProviders = allContextProviders.filter(
            (p) => p.entityName === "subworkflow",
        );
        return _.uniq(subworkflowContextProviders, (p) => p.name);
    }

    /**
     * Extracts a reduced version of the entity config to be stored inside redux state.
     * This is used to track changes to context, monitors, properties, etc. when multiple materials are in state.
     */
    extractReducedExternalDependentConfig() {
        return {
            id: this.id,
            context: this.context || {},
            units: this.units.map((unit) => unit.extractReducedExternalDependentConfig()),
        };
    }

    /**
     * Applies the reduced config obtained from extractReducedExternalDependentConfig on the entity.
     */
    applyReducedExternalDependentConfig(config) {
        this.context = config.context || {};
        this.units.forEach((unit) => {
            const unitConfig = (config.units || []).find((c) => c.id === unit.flowchartId);
            unit.applyReducedExternalDependentConfig(unitConfig || {});
        });
    }

    get contextFromAssignmentUnits() {
        const ctx = {};
        this.units
            .filter((u) => u.type === UNIT_TYPES.assignment)
            .forEach((u) => {
                ctx[u.operand] = u.value;
            });
        return ctx;
    }

    render(context = {}) {
        const ctx = {
            ...context,
            application: this.application,
            methodData: this.model.Method.data,
            model: this.model.toJSON(),
            // context below is assembled from context providers and passed to units to override theirs
            ...this.context,
            subworkflowContext: this.contextFromAssignmentUnits,
        };

        this.units.forEach((u) => u.render(ctx));
    }

    /**
     * TODO: reuse workflow function instead
     */
    addUnit(unit: BaseUnit, index = -1) {
        const { units } = this;
        if (units.length === 0) {
            unit.head = true;
            this.setUnits([unit]);
        } else {
            if (index >= 0) units.splice(index, 0, unit);
            else units.push(unit);
            this.setUnits(setNextLinks(setUnitsHead(units)));
        }
    }

    removeUnit(flowchartId: string) {
        const previousUnit = this.units.find((x) => x.next === flowchartId);
        if (previousUnit) previousUnit.unsetProp("next");
        // TODO: remove the setNextLinks and setUnitsHead and handle the logic via flowchart designer
        this.setUnits(
            setNextLinks(setUnitsHead(this.units.filter((x) => x.flowchartId !== flowchartId))),
        );
    }

    get properties() {
        return lodash.flatten(this.units.map((x) => x.resultNames));
    }

    getUnit(flowchartId: string) {
        return this.units.find((x) => x.flowchartId === flowchartId);
    }

    unitIndex(flowchartId: string) {
        return lodash.findIndex(this.units, (unit) => {
            return unit.flowchartId === flowchartId;
        });
    }

    replaceUnit(index: number, unit: BaseUnit) {
        this.units[index] = unit;
        this.setUnits(setNextLinks(setUnitsHead(this.units)));
    }

    // eslint-disable-next-line class-methods-use-this
    get scopeVariables() {
        return ["N_k", "N_k_nonuniform"];
    }

    // eslint-disable-next-line class-methods-use-this
    get scalarResults() {
        return ["total_energy", "pressure"];
    }

    get isMultiMaterial() {
        return this.prop("isMultiMaterial", false);
    }

    get isDraft() {
        return this.prop("isDraft", false);
    }

    setIsDraft(bool: boolean) {
        return this.setProp("isDraft", bool);
    }

    get methodData() {
        return this.model.Method.data;
    }

    /**
     * @summary Calculates hash of the subworkflow. Meaningful fields are units, app and model.
     * units must be sorted topologically before hashing (already sorted).
     */
    calculateHash() {
        const config = this.toJSON();
        const meaningfulFields = {
            application: Utils.specific.removeTimestampableKeysFromConfig(config.application),
            model: this._calculateModelHash(),
            units: _.map(this.units, (u) => u.calculateHash()).join(),
        };
        return Utils.hash.calculateHashFromObject(meaningfulFields);
    }

    _calculateModelHash() {
        const { model } = this.toJSON();
        // ignore empty data object
        if (this.model.Method.omitInHashCalculation) delete model.method.data;
        return Utils.hash.calculateHashFromObject(model);
    }

    findUnitById(id: string) {
        // TODO: come back and refactor after converting flowchartId to id
        return this.units.find((u) => u.flowchartId === id);
    }

    findUnitKeyById(id: string) {
        const index = this.units.findIndex((u) => u.flowchartId === id);
        return `units.${index}`;
    }

    findUnitWithTag(tag: string) {
        return this.units.find((unit) => unit.tags.includes(tag));
    }

    get hasConvergence() {
        return !!this.convergenceParam && !!this.convergenceResult && !!this.convergenceSeries;
    }
}

namedEntityMixin(Subworkflow.prototype);
defaultableEntityMixin(Subworkflow);
subworkflowSchemaMixin(Subworkflow.prototype);
