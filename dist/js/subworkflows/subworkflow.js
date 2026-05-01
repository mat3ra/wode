"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subworkflow = void 0;
var _ade = require("@mat3ra/ade");
var _entity = require("@mat3ra/code/dist/js/entity");
var _hash = require("@mat3ra/code/dist/js/entity/mixins/hash");
var _mode = require("@mat3ra/mode");
var _utils = require("@mat3ra/utils");
var _lodash = _interopRequireDefault(require("lodash"));
var _mixwith = require("mixwith");
var _underscore = _interopRequireDefault(require("underscore"));
var _enums = require("../enums");
var _units = require("../units");
var _utils2 = require("../utils");
var _convergence = require("./convergence");
var _enums2 = require("./convergence/enums");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint max-classes-per-file:0 */
class BaseSubworkflow extends (0, _mixwith.mix)(_entity.NamedDefaultableRepetitionImportantSettingsInMemoryEntity).with(_convergence.ConvergenceMixin, _entity.ContextAndRenderFieldsMixin, _hash.HashedEntityMixin) {}
class Subworkflow extends BaseSubworkflow {
  constructor(config, _Application = _ade.Application, _ModelFactory = _mode.ModelFactory, _UnitFactory = _units.UnitFactory) {
    super(config);
    this._Application = _Application;
    this._ModelFactory = _ModelFactory;
    this._UnitFactory = _UnitFactory;
    this.initialize();
  }
  initialize() {
    this._application = new this._Application(this.prop("application"));
    this._model = this._ModelFactory.create({
      ...this.prop("model"),
      application: this.prop("application")
    });
    this._units = (0, _utils2.setNextLinks)((0, _utils2.setUnitsHead)(this.prop("units", [])), this.id).map(cfg => this._UnitFactory.create(Object.assign(cfg, {
      application: this.application.toJSON()
    })));
  }
  static generateSubworkflowId(name, application = null, model = null, method = null) {
    const appName = application ? application.name || application : "";
    const modelInfo = model ? `${(model.toJSON?.() || model).type}-${(model.toJSON?.() || model).subtype || ""}` : "";
    const methodInfo = method ? `${(method.toJSON?.() || method).type}-${(method.toJSON?.() || method).subtype || ""}` : "";
    const seed = [`subworkflow-${name}`, appName, modelInfo, methodInfo].filter(p => p).join("-");
    if (this.usePredefinedIds) return _utils.Utils.uuid.getUUIDFromNamespace(seed);
    return _utils.Utils.uuid.getUUID();
  }
  static get defaultConfig() {
    const defaultName = "New Subworkflow";
    return {
      _id: this.generateSubworkflowId(defaultName),
      name: defaultName,
      application: _ade.Application.defaultConfig,
      model: _mode.Model.defaultConfig,
      properties: [],
      units: []
    };
  }

  /*
   * @returns {SubworkflowUnit}
   */
  getAsUnit() {
    return this._UnitFactory.create({
      type: _enums.UNIT_TYPES.subworkflow,
      _id: this.id,
      name: this.name
    });
  }

  /*
   * @summary Used to generate initial application tree, therefore omit setting application.
   */
  static fromArguments(application, model, method, name, units = [], config = {}, Cls = Subworkflow) {
    const nameForIdGeneration = config.attributes?.name || name;
    const {
      functions,
      attributes,
      ...cleanConfig
    } = config;

    // Set the method on the model so it can be properly serialized
    model.setMethod(method);
    return new Cls({
      ...cleanConfig,
      _id: Cls.generateSubworkflowId(nameForIdGeneration, application, model, method),
      name,
      application: application.toJSON(),
      properties: _lodash.default.sortedUniq(_lodash.default.flatten(units.filter(x => x.resultNames).map(x => x.resultNames))),
      model: {
        ...model.toJSON(),
        method: method.toJSON()
      },
      units: units.map(unit => unit.toJSON ? unit.toJSON() : unit)
    });
  }
  get application() {
    return this._application;
  }
  setApplication(application) {
    // TODO: adjust the logic above to take into account whether units need re-rendering after version change etc.
    // reset units if application name changes
    const previousApplicationName = this.application.name;
    this._application = application;
    if (previousApplicationName !== application.name) {
      // TODO: figure out how to set a default unit per new application instead of removing all
      this.setUnits([]);
    } else {
      // propagate new application version to all units
      this.units.filter(unit => typeof unit.setApplication === "function").forEach(unit => unit.setApplication(application, true));
    }
    this.setProp("application", application.toJSON());
    // set model to the default one for the application selected
    this.setModel(this._ModelFactory.createFromApplication({
      application: this.prop("application")
    }));
  }
  get model() {
    return this._model;
  }
  setModel(model) {
    this._model = model;
  }
  get units() {
    return this._units;
  }
  setUnits(units) {
    this._units = units;
  }
  toJSON(exclude = []) {
    return {
      ...super.toJSON(exclude),
      model: this.model.toJSON(),
      units: this.units.map(x => x.toJSON()),
      ...(this.compute ? {
        compute: this.compute
      } : {}) // {"compute": null } won't pass esse validation
    };
  }
  get contextProviders() {
    const unitsWithContextProviders = this.units.filter(u => u.allContextProviders && u.allContextProviders.length);
    const allContextProviders = _underscore.default.flatten(unitsWithContextProviders.map(u => u.allContextProviders));
    const subworkflowContextProviders = allContextProviders.filter(p => p.isSubworkflowContextProvider);
    return _underscore.default.uniq(subworkflowContextProviders, p => p.name);
  }

  /**
   * Extracts a reduced version of the entity config to be stored inside redux state.
   * This is used to track changes to context, monitors, properties, etc. when multiple materials are in state.
   */
  extractReducedExternalDependentConfig() {
    return {
      id: this.id,
      context: this.context || {},
      units: this.units.map(unit => unit.extractReducedExternalDependentConfig())
    };
  }

  /**
   * Applies the reduced config obtained from extractReducedExternalDependentConfig on the entity.
   */
  applyReducedExternalDependentConfig(config) {
    this.context = config.context || {};
    this.units.forEach(unit => {
      const unitConfig = (config.units || []).find(c => c.id === unit.flowchartId);
      unit.applyReducedExternalDependentConfig(unitConfig || {});
    });
  }
  get contextFromAssignmentUnits() {
    const ctx = {};
    this.units.filter(u => u.type === _enums.UNIT_TYPES.assignment).forEach(u => {
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
      subworkflowContext: this.contextFromAssignmentUnits
    };
    this.units.forEach(u => u.render(ctx));
  }

  /**
   * TODO: reuse workflow function instead
   * @param unit {Unit}
   * @param head {Boolean}
   * @param index {Number}
   */
  addUnit(unit, index = -1) {
    const {
      units
    } = this;
    if (units.length === 0) {
      unit.head = true;
      this.setUnits([unit]);
    } else {
      if (index >= 0) units.splice(index, 0, unit);else units.push(unit);
      this.setUnits((0, _utils2.setNextLinks)((0, _utils2.setUnitsHead)(units)));
    }
  }
  removeUnit(flowchartId) {
    const previousUnit = this.units.find(x => x.next === flowchartId);
    if (previousUnit) previousUnit.unsetProp("next");
    // TODO: remove the setNextLinks and setUnitsHead and handle the logic via flowchart designer
    this.setUnits((0, _utils2.setNextLinks)((0, _utils2.setUnitsHead)(this.units.filter(x => x.flowchartId !== flowchartId))));
  }
  get properties() {
    return _lodash.default.flatten(this.units.map(x => x.resultNames));
  }
  getUnit(flowchartId) {
    return this.units.find(x => x.flowchartId === flowchartId);
  }
  unitIndex(flowchartId) {
    return _lodash.default.findIndex(this.units, unit => {
      return unit.flowchartId === flowchartId;
    });
  }
  replaceUnit(index, unit) {
    this.units[index] = unit;
    this.setUnits((0, _utils2.setNextLinks)((0, _utils2.setUnitsHead)(this.units)));
  }

  // eslint-disable-next-line class-methods-use-this
  get scopeVariables() {
    return [_enums2.ConvergenceParameterName.N_k, _enums2.ConvergenceParameterName.N_k_nonuniform];
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
  setIsDraft(bool) {
    return this.setProp("isDraft", bool);
  }
  get methodData() {
    return this.model.Method.data;
  }

  /**
   * @summary
   * Returns object for hashing of the workflow. Meaningful fields are units, app and model.
   * units must be sorted topologically before hashing (already sorted).
   */
  getHashObject() {
    const config = this.toJSON();
    const meaningfulFields = {
      application: new _ade.Application(config.application).calculateHash(),
      model: new _mode.Model(config.model).calculateHash(),
      units: _underscore.default.map(this.units, u => u.calculateHash()).join()
    };
    return meaningfulFields;
  }
  findUnitById(id) {
    // TODO: come back and refactor after converting flowchartId to id
    return this.units.find(u => u.flowchartId === id);
  }
  findUnitKeyById(id) {
    const index = this.units.findIndex(u => u.flowchartId === id);
    return `units.${index}`;
  }
  findUnitWithTag(tag) {
    return this.units.find(unit => unit.tags.includes(tag));
  }
  get hasConvergence() {
    return !!this.convergenceParam && !!this.convergenceResult && !!this.convergenceSeries;
  }
}
exports.Subworkflow = Subworkflow;
_defineProperty(Subworkflow, "usePredefinedIds", false);