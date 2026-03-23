"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ade_1 = require("@mat3ra/ade");
const standata_1 = require("@mat3ra/standata");
const utils_1 = require("@mat3ra/utils");
const providers_1 = require("../context/providers");
const ExecutionUnitSchemaMixin_1 = require("../generated/ExecutionUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
const ExecutionUnitInput_1 = __importDefault(require("./ExecutionUnitInput"));
const standata = new standata_1.ApplicationStandata();
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
        this.applicationInstance = new ade_1.Application(standata.getApplication(application));
        this.setProp("application", this.applicationInstance.toJSON());
        this.setExecutable({ executable, flavor });
    }
    setExecutable({ executable, flavor }) {
        const { executable: executablePlain } = standata.getExecutableAndFlavorByName(this.application.name);
        this.executableInstance = new ade_1.Executable(executable || executablePlain);
        this.allowedResults = this.executableInstance.results;
        this.allowedMonitors = this.executableInstance.monitors;
        this.allowedPostProcessors = this.executableInstance.postProcessors;
        this.setProp("executable", this.executableInstance.toJSON());
        this.setFlavor(flavor);
    }
    setFlavor(flavor) {
        const { flavor: defaultFlavor } = standata.getExecutableAndFlavorByName(this.application.name, this.executable.name);
        this.flavorInstance = new ade_1.Flavor(flavor || defaultFlavor);
        this.defaultMonitors = this.flavorInstance.monitors;
        this.defaultResults = this.flavorInstance.results;
        this.defaultPostProcessors = this.flavorInstance.postProcessors;
        this.setProp("flavor", this.flavorInstance.toJSON());
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }
    setDefaultInput() {
        const inputs = standata.getInput(this.flavorInstance);
        this.inputInstances = inputs.map(ExecutionUnitInput_1.default.createFromTemplate);
    }
    getContextProvidersInstances(externalContext) {
        const uniqueContextProviderNames = [
            ...new Set(this.inputInstances
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
    render(externalContext) {
        const contextProviders = this.getContextProvidersInstances(externalContext);
        const fullContext = contextProviders.map((provider) => provider.getContextItemData());
        this.saveContext(fullContext, externalContext);
        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }
    saveContext(fullContext, externalContext) {
        // persistent context
        this.context = fullContext.filter((c) => c.isEdited);
        this.renderingContext = {
            ...Object.fromEntries(fullContext.map((context) => [context.name, context.data])),
            ...externalContext,
        };
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
(0, ExecutionUnitSchemaMixin_1.executionUnitSchemaMixin)(ExecutionUnit.prototype);
exports.default = ExecutionUnit;
