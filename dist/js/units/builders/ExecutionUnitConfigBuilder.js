"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionUnitConfigBuilder = void 0;
/* eslint-disable class-methods-use-this */
const ade_1 = require("@mat3ra/ade");
const enums_1 = require("../../enums");
const UnitConfigBuilder_1 = require("./UnitConfigBuilder");
class ExecutionUnitConfigBuilder extends UnitConfigBuilder_1.UnitConfigBuilder {
    constructor(name, application, execName, flavorName, flowchartId, cache = []) {
        super({ name, type: enums_1.UNIT_TYPES.execution, flowchartId, cache });
        try {
            this.initialize(application, execName, flavorName);
        }
        catch (e) {
            console.error(`Can't initialize executable/flavor: ${execName}/${flavorName}`);
            throw e;
        }
        // initialize runtimeItems
        this._results = this.flavor.results;
        this._monitors = this.flavor.monitors;
        this._preProcessors = this.flavor.preProcessors;
        this._postProcessors = this.flavor.postProcessors;
    }
    initialize(application, execName, flavorName) {
        this.application = application;
        this.executable = this._createExecutable(this.application, execName);
        this.flavor = this._createFlavor(this.executable, flavorName);
    }
    build() {
        return {
            ...super.build(),
            application: this.application.toJSON(),
            executable: this.executable.toJSON(),
            flavor: this.flavor.toJSON(),
        };
    }
    /**
     * Creates an executable instance. This method is intended to be overridden in subclasses.
     * @param {Application} application - The application object
     * @param {string} execName - The name of the executable
     * @returns {Executable} The created executable instance
     */
    _createExecutable(application, execName) {
        return ade_1.ApplicationRegistry.getExecutableByName(application.name, execName);
    }
    /**
     * Creates a flavor instance. This method is intended to be overridden in subclasses.
     * @param {Executable} executable - The executable object
     * @param {string} flavorName - The name of the flavor
     * @returns {Flavor} The created flavor instance
     */
    _createFlavor(executable, flavorName) {
        return ade_1.ApplicationRegistry.getFlavorByName(executable, flavorName);
    }
}
exports.ExecutionUnitConfigBuilder = ExecutionUnitConfigBuilder;
