import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ExecutionUnitInputItemSchema, ExecutionUnitSchema } from "@mat3ra/esse/dist/js/types";
import { ApplicationRegistry, applicationVersionSatisfiesSupportedRange } from "@mat3ra/standata";
import { Utils } from "@mat3ra/utils";

import {
    type AnyContextProvider,
    type ExternalContext,
    createProvider,
} from "../context/providers";
import type ConvergenceParameter from "../convergence/ConvergenceParameter";
import { UnitType } from "../enums";
import {
    type ExecutionUnitSchemaMixin,
    executionUnitSchemaMixin,
} from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";

type Schema = ExecutionUnitSchema;

type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;

export type ExecutionUnitConfig = Omit<Partial<Schema>, "executable" | "flavor" | "application"> &
    SetApplicationProps;

type SetApplicationProps = Pick<Schema, "application"> & SetExecutableProps;

type SetExecutableProps = {
    executableName?: string;
    flavorName?: string;
};

class ExecutionUnit extends (BaseUnit as Base) implements Schema {
    inputInstances: ExecutionUnitInput[] = [];

    renderingContext: Partial<ExternalContext> = {};

    contextProvidersInstances: AnyContextProvider[] = [];

    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/execution");
    }

    constructor(config: ExecutionUnitConfig) {
        const schema = {
            name: UnitType.execution,
            type: UnitType.execution as Schema["type"],
            input: [],
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            context: [],
            ...config,
        };
        super(schema);

        this.setApplication(config);

        this.name = this.name || this.flavor.name || "";
    }

    setApplication({ application, executableName, flavorName }: SetApplicationProps) {
        this.setProp("application", application);
        this.setExecutable({ executableName, flavorName });
    }

    setExecutable({ executableName, flavorName }: SetExecutableProps) {
        const executable = new ApplicationRegistry()
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

    setFlavor(flavorName?: string) {
        const flavor = new ApplicationRegistry()
            .getFlavorsByApplicationExecutable(this.application, this.executable)
            .find((flavor) => (flavorName ? flavor.name === flavorName : flavor.isDefault));

        if (!flavor) {
            throw new Error(`Flavor ${flavorName} not found`);
        }

        this.defaultResults = flavor.results;
        this.defaultMonitors = flavor.monitors;
        this.defaultPreProcessors = flavor.preProcessors;
        this.defaultPostProcessors = flavor.postProcessors;

        if (this.flavor?.name !== flavor.name) {
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
    private isPersistedInputItemCompatible(item: ExecutionUnitInputItemSchema): boolean {
        const { template } = item;

        if (
            template.applicationName !== this.application.name ||
            template.executableName !== this.executable.name
        ) {
            return false;
        }

        if (
            !applicationVersionSatisfiesSupportedRange(
                this.application.version,
                template.applicationVersion ?? "",
            )
        ) {
            return false;
        }

        return true;
    }

    /**
     * Build `inputInstances` from the current flavor’s defaults (`ApplicationRegistry#getInput(this.flavor)`),
     * merged with persisted `this.input` from saved workflow JSON. For each input slot from the registry we
     * prefer a compatible persisted row matched by `template.name`, else by index; incompatible or missing
     * rows use the registry template. `render()` then serializes from these instances into `this.input`, so UI
     * and saved JSON stay aligned when Subworkflow re-serializes units after render.
     */
    setDefaultInput() {
        const driverTemplates = new ApplicationRegistry().getInput(this.flavor);
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

        this.input = this.inputInstances.map((input) => input.toJSON());
    }

    render(externalContext: ExternalContext, convergence?: ConvergenceParameter) {
        this.contextProvidersInstances = this.getContextProvidersInstances(
            externalContext,
            convergence,
        );

        this.saveContext(externalContext);
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

    savePersistentContext() {
        const persistentItems = this.contextProvidersInstances.map((p) => p.getContextItemData());
        this.context = persistentItems.filter((c) => c.isEdited);
    }

    saveRenderingContext(externalContext: ExternalContext) {
        const renderingItems = this.contextProvidersInstances.map((p) =>
            p.getContextItemDataForRendering(),
        );
        this.renderingContext = {
            ...Object.fromEntries(renderingItems.map((context) => [context.name, context.data])),
            ...externalContext,
        };
        this.input = this.inputInstances.map((input) => {
            return input.render(this.renderingContext).toJSON();
        });
    }

    saveContext(externalContext: ExternalContext) {
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
