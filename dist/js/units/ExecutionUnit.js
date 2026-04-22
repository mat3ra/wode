"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const utils_1 = require("@mat3ra/utils");
const providers_1 = require("../context/providers");
const settings_1 = require("../context/providers/settings");
const enums_1 = require("../enums");
const ExecutionUnitSchemaMixin_1 = require("../generated/ExecutionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
const ExecutionUnitInput_1 = __importDefault(require("./ExecutionUnitInput"));
const RUNTIME_ITEM_KEYS = ["results", "monitors", "preProcessors", "postProcessors"];
class ExecutionUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/execution");
    }
    constructor(config) {
        const { executable, flavor } = settings_1.globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
            appName: config.application.name,
            appVersion: config.application.version,
        });
        const schema = {
            name: enums_1.UnitType.execution,
            type: enums_1.UnitType.execution,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            executable,
            flavor,
            context: [],
            ...config,
        };
        super(schema);
        this.inputInstances = [];
        this.renderingContext = {};
        this.contextProvidersInstances = [];
        this.setApplication(config);
        this.name = this.name || this.flavor.name || "";
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
        const prior = {
            results: this.results.slice(),
            monitors: this.monitors.slice(),
            preProcessors: this.preProcessors.slice(),
            postProcessors: this.postProcessors.slice(),
        };
        const { executable, application } = this;
        const { executable: driverExecutable, flavor: defaultFlavor } = settings_1.globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
            appName: application.name,
            appVersion: application.version,
            execName: executable.name,
        });
        const finalFlavor = flavor || defaultFlavor;
        this.defaultResults = finalFlavor.results;
        this.defaultMonitors = finalFlavor.monitors;
        this.defaultPreProcessors = finalFlavor.preProcessors;
        this.defaultPostProcessors = finalFlavor.postProcessors;
        RUNTIME_ITEM_KEYS.forEach((key) => {
            this[key] = ExecutionUnit.keepValidOrFallbackToDefaults(prior[key], finalFlavor[key], driverExecutable[key]);
        });
        this.setProp("flavor", finalFlavor);
        this.setDefaultInput();
    }
    /**
     * Keep prior runtime items whose `name` still appears on the executable; otherwise fall back to
     * flavor defaults. `defaults` is cloned so later `toggle*` mutations never touch flavor arrays.
     */
    static keepValidOrFallbackToDefaults(prior, defaults, allowed) {
        const allowedNames = new Set(allowed.map((a) => a.name));
        const kept = prior.filter((item) => allowedNames.has(item.name));
        return kept.length ? kept : defaults.slice();
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
    render(externalContext, convergence) {
        this.contextProvidersInstances = this.getContextProvidersInstances(externalContext, convergence);
        const fullContext = this.contextProvidersInstances.map((p) => p.getContextItemData());
        this.saveContext(fullContext, externalContext);
    }
    getContextProvidersInstances(externalContext, convergence) {
        const uniqueContextProviderNames = [
            ...new Set(this.input
                .map((input) => {
                return input.template.contextProviders.map((provider) => {
                    return provider.name;
                });
            })
                .flat()),
        ];
        // TODO: kgrid should be abstracted and selected by user
        const parameterToContextProviderMap = {
            N_k: "kgrid",
            N_k_nonuniform: "kgrid",
        };
        return uniqueContextProviderNames
            .map((name) => {
            return (0, providers_1.createProvider)(name, this.context, externalContext);
        })
            .map((provider) => {
            if (convergence &&
                provider.name === parameterToContextProviderMap[convergence.name]) {
                provider.applyConvergenceParameter(convergence);
            }
            return provider;
        });
    }
    saveContext(fullContext, externalContext) {
        // persistent context
        this.context = fullContext.filter((c) => c.isEdited);
        this.renderingContext = {
            ...Object.fromEntries(fullContext.map((context) => [context.name, context.data])),
            ...externalContext,
        };
        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }
    getHashObject() {
        const { input, flavor, application, executable } = this.toJSON();
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
