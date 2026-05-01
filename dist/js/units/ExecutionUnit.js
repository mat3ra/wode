"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const providers_1 = require("../context/providers");
const enums_1 = require("../enums");
const ExecutionUnitSchemaMixin_1 = require("../generated/ExecutionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
const ExecutionUnitInput_1 = __importDefault(require("./ExecutionUnitInput"));
class ExecutionUnit extends BaseUnit_1.default {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/execution");
    }
    constructor(config) {
        const schema = {
            name: enums_1.UnitType.execution,
            type: enums_1.UnitType.execution,
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
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
    setApplication({ application, executableName, flavorName }) {
        this.setProp("application", application);
        this.setExecutable({ executableName, flavorName });
    }
    setExecutable({ executableName, flavorName }) {
        const executable = new standata_1.ApplicationRegistry()
            .getExecutablesByApplication(this.application)
            .find((executable) => {
            return executableName ? executable.name === executableName : executable.isDefault;
        });
        if (!executable) {
            throw new Error(`Executable ${executableName} not found`);
        }
        this.setProp("executable", executable);
        this.setFlavor(flavorName);
    }
    setFlavor(flavorName) {
        var _a;
        const flavor = new standata_1.ApplicationRegistry()
            .getFlavorsByApplicationExecutable(this.application, this.executable)
            .find((flavor) => (flavorName ? flavor.name === flavorName : flavor.isDefault));
        if (!flavor) {
            throw new Error(`Flavor ${flavorName} not found`);
        }
        this.defaultResults = flavor.results;
        this.defaultMonitors = flavor.monitors;
        this.defaultPreProcessors = flavor.preProcessors;
        this.defaultPostProcessors = flavor.postProcessors;
        if (((_a = this.flavor) === null || _a === void 0 ? void 0 : _a.name) !== flavor.name) {
            this.results = flavor.results;
            this.monitors = flavor.monitors;
            this.preProcessors = flavor.preProcessors;
            this.postProcessors = flavor.postProcessors;
        }
        this.setProp("flavor", flavor);
        this.setDefaultInput();
    }
    /**
     * Persisted `input[].template` must match the current application/executable (and optional
     * applicationVersion). Otherwise the stored template is stale, and we take the default from
     * ApplicationRegistry.
     */
    isPersistedInputItemCompatible(item) {
        var _a;
        const { template } = item;
        if (template.applicationName !== this.application.name ||
            template.executableName !== this.executable.name) {
            return false;
        }
        if (!(0, standata_1.applicationVersionSatisfiesSupportedRange)(this.application.version, (_a = template.applicationVersion) !== null && _a !== void 0 ? _a : "")) {
            return false;
        }
        return true;
    }
    /**
     * Build `inputInstances` from the current flavor’s defaults (`ApplicationRegistry#getInput(application, flavor)`),
     * merged with persisted `this.input` from saved workflow JSON. For each input slot from the registry we
     * prefer a compatible persisted row matched by `template.name`, else by index; incompatible or missing
     * rows use the registry template. `render()` then serializes from these instances into `this.input`, so UI
     * and saved JSON stay aligned when Subworkflow re-serializes units after render.
     */
    setDefaultInput() {
        const driverTemplates = new standata_1.ApplicationRegistry().getInput(this.application, this.flavor);
        const persisted = Array.isArray(this.input) ? this.input : [];
        this.inputInstances = driverTemplates.map((driverTemplate, index) => {
            var _a;
            const persistedItem = (_a = persisted.find((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.template) === null || _a === void 0 ? void 0 : _a.name) === driverTemplate.name; })) !== null && _a !== void 0 ? _a : persisted[index];
            if (persistedItem && this.isPersistedInputItemCompatible(persistedItem)) {
                return new ExecutionUnitInput_1.default(persistedItem);
            }
            return ExecutionUnitInput_1.default.createFromTemplate(driverTemplate);
        });
        this.input = this.inputInstances.map((input) => input.toJSON());
    }
    render(externalContext, convergence) {
        this.contextProvidersInstances = this.getContextProvidersInstances(externalContext, convergence);
        this.saveContext(externalContext);
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
    savePersistentContext() {
        const persistentItems = this.contextProvidersInstances.map((p) => p.getContextItemData());
        this.context = persistentItems.filter((c) => c.isEdited);
    }
    saveRenderingContext(externalContext) {
        const renderingItems = this.contextProvidersInstances.map((p) => p.getContextItemDataForRendering());
        this.renderingContext = {
            ...Object.fromEntries(renderingItems.map((context) => [context.name, context.data])),
            ...externalContext,
        };
        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }
    saveContext(externalContext) {
        this.savePersistentContext();
        this.saveRenderingContext(externalContext);
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
