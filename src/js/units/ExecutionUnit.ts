import { Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ContextItemSchema,
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

type ExecutionUnitConfig = Omit<Schema, "executable" | "flavor"> & SetExecutableProps;

type SetApplicationProps = Pick<Schema, "application"> & SetExecutableProps;

type SetExecutableProps = Partial<Pick<Schema, "executable" | "flavor">>;

const standata = new ApplicationStandata();

class ExecutionUnit extends (BaseUnit as Base) implements Schema {
    inputInstances: ExecutionUnitInput[] = [];

    renderingContext: Partial<ExternalContext> = {};

    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    constructor(config: ExecutionUnitConfig) {
        super(config);

        const { application, executable, flavor } = config;

        this.setApplication({ application, executable, flavor });

        this.name = this.name || this.flavor?.name || "";
    }

    setApplication({ application, executable, flavor }: SetApplicationProps) {
        this.setProp("application", application);
        this.setExecutable({ executable, flavor });
    }

    setExecutable({ executable, flavor }: SetExecutableProps) {
        const { executable: executablePlain } = standata.getExecutableAndFlavorByName(
            this.application.name,
        );

        const finalExecutable = executable || executablePlain;

        this.setProp("executable", finalExecutable);
        this.setFlavor(flavor);
    }

    setFlavor(flavor?: Flavor | FlavorSchema) {
        const { executable, application } = this;
        const { flavor: defaultFlavor } = standata.getExecutableAndFlavorByName(
            application.name,
            executable.name,
        );

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
            .map(ExecutionUnitInput.createFromTemplate);
    }

    render(externalContext: ExternalContext) {
        const contextProviders = this.getContextProvidersInstances(externalContext);
        const fullContext = contextProviders.map((provider) => provider.getContextItemData());

        this.saveContext(fullContext, externalContext);

        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }

    getContextProvidersInstances(externalContext: ExternalContext) {
        const uniqueContextProviderNames = [
            ...new Set(
                this.input
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

    private saveContext(fullContext: ContextItemSchema[], externalContext: ExternalContext) {
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
            input: Utils.hash.calculateHashFromObject(
                input.map(({ template }) => {
                    return Utils.str.removeEmptyLinesFromString(
                        Utils.str.removeCommentsFromSourceCode(template.content),
                    );
                }),
            ),
        };
    }
}

executionUnitSchemaMixin(ExecutionUnit.prototype);

export default ExecutionUnit;
