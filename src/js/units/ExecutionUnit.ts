import { Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
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
import { UnitType } from "../enums";
import {
    type ExecutionUnitSchemaMixin,
    executionUnitSchemaMixin,
} from "../generated/ExecutionUnitSchemaMixin";
import BaseUnit from "./BaseUnit";
import ExecutionUnitInput from "./ExecutionUnitInput";

type Schema = ExecutionUnitSchema;

type Base = typeof BaseUnit & Constructor<ExecutionUnitSchemaMixin>;

const RUNTIME_ITEM_KEYS = ["results", "monitors", "preProcessors", "postProcessors"] as const;
type RuntimeItemKey = (typeof RUNTIME_ITEM_KEYS)[number];

export type ExecutionUnitConfig = Omit<Partial<Schema>, "executable" | "flavor" | "application"> &
    SetApplicationProps;

type SetApplicationProps = Pick<Schema, "application"> & SetExecutableProps;

type SetExecutableProps = Partial<Pick<Schema, "executable" | "flavor">>;

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
        const { executable, flavor } = globalSettings
            .getApplicationsDriver()
            .getExecutableAndFlavorByName({
                appName: config.application.name,
                appVersion: config.application.version,
            });

        const schema = {
            name: UnitType.execution,
            type: UnitType.execution as Schema["type"],
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

        this.setApplication(config);

        this.name = this.name || this.flavor.name || "";
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
        const prior: Record<RuntimeItemKey, { name: string }[]> = {
            results: this.results.slice(),
            monitors: this.monitors.slice(),
            preProcessors: this.preProcessors.slice(),
            postProcessors: this.postProcessors.slice(),
        };

        const { executable, application } = this;
        const { executable: driverExecutable, flavor: defaultFlavor } = globalSettings
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
            this[key] = ExecutionUnit.keepValidOrFallbackToDefaults(
                prior[key],
                finalFlavor[key],
                driverExecutable[key],
            );
        });

        this.setProp("flavor", finalFlavor);
        this.setDefaultInput();
    }

    /**
     * Keep prior runtime items whose `name` still appears on the executable; otherwise fall back to
     * flavor defaults. `defaults` is cloned so later `toggle*` mutations never touch flavor arrays.
     */
    private static keepValidOrFallbackToDefaults<T extends { name: string }>(
        prior: T[],
        defaults: T[],
        allowed: ReadonlyArray<{ name: string }>,
    ): T[] {
        const allowedNames = new Set(allowed.map((a) => a.name));
        const kept = prior.filter((item) => allowedNames.has(item.name));
        return kept.length ? kept : defaults.slice();
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
