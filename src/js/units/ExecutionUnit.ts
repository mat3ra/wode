import { Application, Executable, Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ApplicationSchema,
    ContextItemSchema,
    ExecutableSchema,
    ExecutionUnitSchema,
    FlavorSchema,
} from "@mat3ra/esse/dist/js/types";
import { ApplicationStandata } from "@mat3ra/standata";
import { Utils } from "@mat3ra/utils";

import { type ExternalContext, createProvider } from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import {
    type ExecutionUnitSchemaMixin,
    executionUnitSchemaMixin,
} from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";

type Schema = ExecutionUnitSchema;
type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;

interface SetApplicationProps {
    application: Application | ApplicationSchema;
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}

type SetExecutableProps = Pick<SetApplicationProps, "executable" | "flavor">;

const standata = new ApplicationStandata();

class ExecutionUnit extends (BaseUnit as Base) implements Schema {
    applicationInstance!: Application;

    executableInstance!: Executable;

    flavorInstance!: Flavor;

    inputInstances: ExecutionUnitInput[] = [];

    renderingContext: Partial<ExternalContext> = {};

    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    constructor(config: Schema) {
        super(config);

        const { application, executable, flavor } = config;

        this.setApplication({ application, executable, flavor });

        this.name = this.name || this.flavor?.name || "";
    }

    setApplication({ application, executable, flavor }: SetApplicationProps) {
        this.applicationInstance = new Application(standata.getApplication(application));
        this.setProp("application", this.applicationInstance.toJSON());
        this.setExecutable({ executable, flavor });
    }

    setExecutable({ executable, flavor }: SetExecutableProps) {
        const { executable: executablePlain } = standata.getExecutableAndFlavorByName(
            this.application.name,
        );

        this.executableInstance = new Executable(executable || executablePlain);
        this.allowedResults = this.executableInstance.results;
        this.allowedMonitors = this.executableInstance.monitors;
        this.allowedPostProcessors = this.executableInstance.postProcessors;

        this.setProp("executable", this.executableInstance.toJSON());
        this.setFlavor(flavor);
    }

    setFlavor(flavor?: Flavor | FlavorSchema) {
        const { flavor: defaultFlavor } = standata.getExecutableAndFlavorByName(
            this.application.name,
            this.executable.name,
        );

        this.flavorInstance = new Flavor(flavor || defaultFlavor);
        this.defaultMonitors = this.flavorInstance.monitors;
        this.defaultResults = this.flavorInstance.results;
        this.defaultPostProcessors = this.flavorInstance.postProcessors;

        this.setProp("flavor", this.flavorInstance.toJSON());
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }

    setDefaultInput() {
        const inputs = standata.getInput(this.flavorInstance);
        this.inputInstances = inputs.map(ExecutionUnitInput.createFromTemplate);
    }

    getContextProvidersInstances(externalContext: ExternalContext) {
        const uniqueContextProviderNames = [
            ...new Set(
                this.inputInstances
                    .map((input) => {
                        return input.template.contextProviders.map((provider) => {
                            return provider.name;
                        });
                    })
                    .flat(),
            ),
        ];

        return uniqueContextProviderNames.map((name) => {
            return createProvider(name, this.context, externalContext);
        });
    }

    addConvergenceContext(parameter: ConvergenceParameter, externalContext: ExternalContext) {
        // TODO: kgrid should be abstracted and selected by user
        const parameterToContextProviderMap = {
            N_k: "kgrid",
            N_k_nonuniform: "kgrid",
        } as const;

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

    render(externalContext: ExternalContext) {
        const contextProviders = this.getContextProvidersInstances(externalContext);
        const fullContext = contextProviders.map((provider) => provider.getContextItemData());

        this.saveContext(fullContext, externalContext);

        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }

    private saveContext(fullContext: ContextItemSchema[], externalContext: ExternalContext) {
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
            application: Utils.specific.removeTimestampableKeysFromConfig(
                this.applicationInstance.toJSON(),
            ),
            executable: Utils.specific.removeTimestampableKeysFromConfig(
                this.executableInstance.toJSON(),
            ),
            flavor: this.flavorInstance
                ? Utils.specific.removeTimestampableKeysFromConfig(this.flavorInstance.toJSON())
                : undefined,
            input: Utils.hash.calculateHashFromObject(
                this.input.map((i) => {
                    return Utils.str.removeEmptyLinesFromString(
                        Utils.str.removeCommentsFromSourceCode(i.template.content),
                    );
                }),
            ),
        };
    }
}

executionUnitSchemaMixin(ExecutionUnit.prototype);

export default ExecutionUnit;
