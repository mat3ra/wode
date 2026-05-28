"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionUnit = void 0;
const ade_1 = require("@mat3ra/ade");
const utils_1 = require("@mat3ra/utils");
const ContextAndRenderFieldsMixin_1 = require("../context/mixins/ContextAndRenderFieldsMixin");
const ImportantSettingsProviderMixin_1 = require("../context/mixins/ImportantSettingsProviderMixin");
const ExecutionUnitInput_1 = __importDefault(require("../ExecutionUnitInput"));
const ExecutionUnitSchemaMixin_1 = require("../generated/ExecutionUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class ExecutionUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        var _a;
        super(config);
        this.inputInstances = [];
        this.renderingContext = [];
        const { application, executable, flavor } = config;
        const applicationInstance = ade_1.ApplicationRegistry.createApplication(application);
        const executableInstance = ade_1.ApplicationRegistry.getExecutableByConfig(application.name, executable);
        const flavorInstance = ade_1.ApplicationRegistry.getFlavorByConfig(executableInstance, flavor);
        if (!flavorInstance) {
            throw new Error("Flavor is not set");
        }
        this.setApplication({
            application: applicationInstance,
            executable: executableInstance,
            flavor: flavorInstance,
        });
        this.name = this.name || ((_a = this.flavor) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    setApplication({ application, executable, flavor }) {
        this.applicationInstance = application;
        this.setProp("application", application.toJSON());
        this.setExecutable({ executable, flavor });
    }
    setExecutable({ executable, flavor }) {
        const defaultExecutable = ade_1.ApplicationRegistry.getExecutableByName(this.application.name);
        const instance = executable instanceof ade_1.Executable
            ? executable
            : new ade_1.Executable(executable !== null && executable !== void 0 ? executable : defaultExecutable.toJSON());
        this.allowedResults = instance.results;
        this.allowedMonitors = instance.monitors;
        this.allowedPostProcessors = instance.postProcessors;
        this.setProp("executable", instance.toJSON());
        this.setFlavor(flavor);
    }
    setFlavor(flavor) {
        const defaultFlavor = ade_1.ApplicationRegistry.getFlavorByConfig(this.executableInstance);
        const instance = flavor instanceof ade_1.Flavor ? flavor : new ade_1.Flavor(flavor !== null && flavor !== void 0 ? flavor : defaultFlavor === null || defaultFlavor === void 0 ? void 0 : defaultFlavor.toJSON());
        if (!instance) {
            throw new Error("Flavor is not found for executable");
        }
        this.flavorInstance = instance;
        this.defaultMonitors = instance.monitors;
        this.defaultResults = instance.results;
        this.defaultPostProcessors = instance.postProcessors;
        this.setProp("flavor", instance.toJSON());
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }
    setDefaultInput() {
        const inputs = ade_1.ApplicationRegistry.getInput(this.flavorInstance);
        this.inputInstances = inputs.map(ExecutionUnitInput_1.default.createFromTemplate);
    }
    get allContextProviders() {
        return this.inputInstances.map((input) => input.contextProvidersInstances).flat();
    }
    get contextProviders() {
        return this.allContextProviders.filter((p) => p.entityName === "unit");
    }
    /** Update rendering context and persistent context
     * Note: this function is sometimes being called without passing a context!
     */
    render(context = {}) {
        this.renderingContext = { ...this.renderingContext, ...context };
        const newInput = [];
        const newPersistentContext = [];
        const newRenderingContext = [];
        this.inputInstances.forEach((input) => {
            input.setContext(this.renderingContext);
            input.render();
            const inputJSON = input.toJSON();
            const context = input.getFullContext();
            newInput.push(inputJSON);
            newRenderingContext.push(...context);
            newPersistentContext.push(...context.filter((c) => c.isEdited));
        });
        this.input = newInput;
        this.renderingContext = newRenderingContext;
        this.context = newPersistentContext;
    }
    /**
     * @summary Calculates hash on unit-specific fields.
     * The meaningful fields of processing unit are operation, flavor and input at the moment.
     */
    getHashObject() {
        return {
            ...super.getHashObject(),
            application: utils_1.Utils.specific.removeTimestampableKeysFromConfig(this.applicationInstance.toJSON()),
            executable: utils_1.Utils.specific.removeTimestampableKeysFromConfig(this.executableInstance.toJSON()),
            flavor: this.flavorInstance
                ? utils_1.Utils.specific.removeTimestampableKeysFromConfig(this.flavorInstance.toJSON())
                : undefined,
            input: utils_1.Utils.hash.calculateHashFromObject(this.input.map((i) => {
                return utils_1.Utils.str.removeEmptyLinesFromString(utils_1.Utils.str.removeCommentsFromSourceCode(i.template.content));
            })),
        };
    }
}
exports.ExecutionUnit = ExecutionUnit;
(0, ExecutionUnitSchemaMixin_1.executionUnitSchemaMixin)(ExecutionUnit.prototype);
(0, ContextAndRenderFieldsMixin_1.contextMixin)(ExecutionUnit.prototype);
(0, ImportantSettingsProviderMixin_1.importantSettingsProviderMixin)(ExecutionUnit.prototype);
