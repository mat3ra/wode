"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.setProp("application", application);
        this.setExecutable({ executable, flavor });
    }
    setExecutable({ executable, flavor }) {
        const { executable: executablePlain } = standata.getExecutableAndFlavorByName(this.application.name);
        const finalExecutable = executable || executablePlain;
        // TODO: clirify how allowed results should work
        // this.allowedResults = finalExecutable.results;
        this.allowedMonitors = finalExecutable.monitors;
        this.allowedPostProcessors = finalExecutable.postProcessors;
        this.setProp("executable", finalExecutable);
        this.setFlavor(flavor);
    }
    setFlavor(flavor) {
        const { executable, application } = this;
        const { flavor: defaultFlavor } = standata.getExecutableAndFlavorByName(application.name, executable.name);
        const finalFlavor = flavor || defaultFlavor;
        this.defaultMonitors = finalFlavor.monitors;
        this.defaultResults = finalFlavor.results;
        this.defaultPostProcessors = finalFlavor.postProcessors;
        this.setProp("flavor", finalFlavor);
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }
    setDefaultInput() {
        this.inputInstances = standata
            .getInput(this.flavor)
            .map(ExecutionUnitInput_1.default.createFromTemplate);
    }
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
