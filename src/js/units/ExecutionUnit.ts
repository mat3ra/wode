import { Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ContextItemSchema,
    ExecutionUnitInputItemSchema,
    ExecutionUnitSchema,
    FlavorSchema,
} from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import {
    type AnyContextProvider,
    type ExternalContext,
    createProvider,
} from "../context/providers";
import { globalSettings } from "../context/providers/settings";
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

class ExecutionUnit extends (BaseUnit as Base) implements Schema {
    inputInstances: ExecutionUnitInput[] = [];

    renderingContext: Partial<ExternalContext> = {};

    contextProvidersInstances: AnyContextProvider[] = [];

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
        const { executable: executablePlain } = globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
                appName: this.application.name,
                appVersion: this.application.version,
            });

        const finalExecutable = executable || executablePlain;

        this.setProp("executable", finalExecutable);
        this.setFlavor(flavor);
    }

    setFlavor(flavor?: Flavor | FlavorSchema) {
        const { executable, application } = this;
        const { flavor: defaultFlavor } = globalSettings
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
    private isPersistedInputItemCompatible(item: ExecutionUnitInputItemSchema): boolean {
        const { template } = item;

        if (
            template.applicationName !== this.application.name ||
            template.executableName !== this.executable.name
        ) {
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
        const driverTemplates = globalSettings.getApplicationsDriver().getInput(this.flavor);
        const persisted = Array.isArray(this.input) ? this.input : [];

        this.inputInstances = driverTemplates.map((driverTemplate, index) => {
            const persistedItem =
                persisted.find((item) => item?.template?.name === driverTemplate.name) ??
                persisted[index];

            if (persistedItem && this.isPersistedInputItemCompatible(persistedItem)) {
                return new ExecutionUnitInput(persistedItem);
            }

            return ExecutionUnitInput.createFromTemplate(driverTemplate);
        });
    }

    render(externalContext: ExternalContext, convergence?: ConvergenceParameter) {
        this.contextProvidersInstances = this.getContextProvidersInstances(
            externalContext,
            convergence,
        );
        const fullContext = this.contextProvidersInstances.map((p) => p.getContextItemData());

        this.saveContext(fullContext, externalContext);
    }

    private getContextProvidersInstances(
        externalContext: ExternalContext,
        convergence?: ConvergenceParameter,
    ) {
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

        // TODO: kgrid should be abstracted and selected by user
        const parameterToContextProviderMap = {
            N_k: "kgrid",
            N_k_nonuniform: "kgrid",
        } as const;

        return uniqueContextProviderNames
            .map((name) => {
                return createProvider(name, this.context, externalContext);
            })
            .map((provider) => {
                if (
                    convergence &&
                    provider.name === parameterToContextProviderMap[convergence.name]
                ) {
                    provider.applyConvergenceParameter(convergence);
                }
                return provider;
            });
    }

    private saveContext(fullContext: ContextItemSchema[], externalContext: ExternalContext) {
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
