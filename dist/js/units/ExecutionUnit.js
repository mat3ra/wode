"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@mat3ra/utils");
const providers_1 = require("../context/providers");
const settings_1 = require("../context/providers/settings");
const ExecutionUnitSchemaMixin_1 = require("../generated/ExecutionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
const ExecutionUnitInput_1 = __importDefault(require("./ExecutionUnitInput"));
class ExecutionUnit extends BaseUnit_1.default {
    constructor(config) {
        var _a;
        super(config);
        this.inputInstances = [];
        this.renderingContext = {};
        const { application, executable, flavor } = config;
        this.setApplication({ application, executable, flavor });
        this.name = this.name || ((_a = this.flavor) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    setApplication({ application, executable, flavor }) {
        this.setProp("application", application);
        this.setExecutable({ executable, flavor });
    }
    setExecutable({ executable, flavor }) {
        const { executable: executablePlain } = settings_1.globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
            appName: this.application.name,
            appVersion: this.application.version,
        });
        const finalExecutable = executable || executablePlain;
        this.setProp("executable", finalExecutable);
        this.setFlavor(flavor);
    }
    setFlavor(flavor) {
        const { executable, application } = this;
        const { flavor: defaultFlavor } = settings_1.globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
            appName: application.name,
            appVersion: application.version,
            execName: executable.name,
        });
        const finalFlavor = flavor || defaultFlavor;
        this.defaultMonitors = finalFlavor.monitors;
        this.defaultResults = finalFlavor.results;
        this.defaultPostProcessors = finalFlavor.postProcessors;
        this.setProp("flavor", finalFlavor);
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }
    /**
     * Persisted `input[].template` must match the current application/executable (and optional
     * applicationVersion). Otherwise the stored template is stale, and we take the default from the driver.
     */
    isPersistedInputItemCompatible(item) {
        const { template } = item;
        if (template.applicationName !== this.application.name ||
            template.executableName !== this.executable.name) {
            return false;
        }
        const { applicationVersion } = template;
        if (applicationVersion && applicationVersion !== this.application.version) {
            return false;
        }
        return true;
    }
    /**
     * Build `inputInstances` from the current flavor’s defaults (`getInput(this.flavor)`), merged with
     * persisted `this.input` from saved workflow JSON. For each driver slot we prefer a compatible
     * persisted row matched by `template.name`, else by index; incompatible or missing rows use the
     * driver template. `render()` then serializes from these instances into `this.input`, so UI and
     * saved JSON stay aligned when Subworkflow re-serializes units after render.
     */
    setDefaultInput() {
        const driverTemplates = settings_1.globalSettings.getApplicationsDriver().getInput(this.flavor);
        const persisted = Array.isArray(this.input) ? this.input : [];
        this.inputInstances = driverTemplates.map((driverTemplate, index) => {
            var _a;
            const persistedItem = (_a = persisted.find((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.template) === null || _a === void 0 ? void 0 : _a.name) === driverTemplate.name; })) !== null && _a !== void 0 ? _a : persisted[index];
            if (persistedItem && this.isPersistedInputItemCompatible(persistedItem)) {
                return new ExecutionUnitInput_1.default(persistedItem);
            }
            return ExecutionUnitInput_1.default.createFromTemplate(driverTemplate);
        });
    }
    /**
     * Resolves context from providers discovered on hydrated `inputInstances` (same source `render`
     * uses to write `this.input`), not stale serialized `this.input` alone.
     */
    render(externalContext) {
        const contextProviders = this.getContextProvidersInstances(externalContext);
        const fullContext = contextProviders.map((provider) => provider.getContextItemData());
        this.saveContext(fullContext, externalContext);
        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }
    getContextProvidersInstances(externalContext) {
        const uniqueContextProviderNames = [
            ...new Set(this.input
                .map((input) => {
                return input.template.contextProviders.map((provider) => {
                    return provider.name;
                });
            })
                .flat()),
        ];
        return uniqueContextProviderNames.map((name) => {
            return (0, providers_1.createProvider)(name, this.context, externalContext);
        });
    }
    addConvergenceContext(parameter, externalContext) {
        // TODO: kgrid should be abstracted and selected by user
        const parameterToContextProviderMap = {
            N_k: "kgrid",
            N_k_nonuniform: "kgrid",
        };
        const contextName = parameterToContextProviderMap[parameter.name];
        const contextProviders = this.getContextProvidersInstances(externalContext);
        const fullContext = contextProviders.map((provider) => {
            if (provider.name === contextName) {
                provider.applyConvergenceParameter(parameter);
                return provider.getContextItemData();
            }
            return provider.getContextItemData();
        });
        this.saveContext(fullContext, externalContext);
    }
    saveContext(fullContext, externalContext) {
        // persistent context
        this.context = fullContext.filter((c) => c.isEdited);
        this.renderingContext = {
            ...Object.fromEntries(fullContext.map((context) => [context.name, context.data])),
            ...externalContext,
        };
    }
    getHashObject() {
        const { application, executable, flavor, input } = this.toJSON();
        return {
            ...super.getHashObject(),
            application,
            executable,
            flavor,
            input: utils_1.Utils.hash.calculateHashFromObject(input.map(({ template }) => {
                return utils_1.Utils.str.removeEmptyLinesFromString(utils_1.Utils.str.removeCommentsFromSourceCode(template.content));
            })),
        };
    }
}
(0, ExecutionUnitSchemaMixin_1.executionUnitSchemaMixin)(ExecutionUnit.prototype);
exports.default = ExecutionUnit;
