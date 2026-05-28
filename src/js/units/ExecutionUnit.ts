import { Application, ApplicationRegistry as AdeRegistry, Executable, Flavor } from "@mat3ra/ade";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ExecutableSchema,
    ExecutionUnitInputItemSchema,
    ExecutionUnitSchemaBase,
    FlavorSchema,
} from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import { contextMixin } from "../context/mixins/ContextAndRenderFieldsMixin";
import {
    type ImportantSettingsProvider,
    importantSettingsProviderMixin,
} from "../context/mixins/ImportantSettingsProviderMixin";
import type { ContextItem } from "../context/providers/base/ContextProvider";
import ExecutionUnitInput from "../ExecutionUnitInput";
import {
    type ExecutionUnitSchemaMixin,
    executionUnitSchemaMixin,
} from "../generated/ExecutionUnitSchemaMixin";
import { BaseUnit } from "./BaseUnit";

type Schema = ExecutionUnitSchemaBase;
type Base = typeof BaseUnit &
    Constructor<ExecutionUnitSchemaMixin> &
    Constructor<ImportantSettingsProvider>;

interface SetApplicationProps {
    application: Application;
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}

interface SetExecutableProps {
    executable?: Executable | ExecutableSchema;
    flavor?: Flavor | FlavorSchema;
}

export type ExecutionUnitSchema = Schema;

export class ExecutionUnit extends (BaseUnit as Base) implements Schema {
    applicationInstance!: Application;

    executableInstance!: Executable;

    flavorInstance!: Flavor;

    inputInstances: ExecutionUnitInput[] = [];

    renderingContext: ContextItem[] = [];

    constructor(config: Schema) {
        super(config);

        const { application, executable, flavor } = config;
        const applicationInstance = AdeRegistry.createApplication(application);
        const executableInstance = AdeRegistry.getExecutableByConfig(application.name, executable);
        const flavorInstance = AdeRegistry.getFlavorByConfig(executableInstance, flavor);

        if (!flavorInstance) {
            throw new Error("Flavor is not set");
        }

        this.setApplication({
            application: applicationInstance,
            executable: executableInstance,
            flavor: flavorInstance,
        });

        this.name = this.name || this.flavor?.name || "";
    }

    setApplication({ application, executable, flavor }: SetApplicationProps) {
        this.applicationInstance = application;
        this.setProp("application", application.toJSON());
        this.setExecutable({ executable, flavor });
    }

    setExecutable({ executable, flavor }: SetExecutableProps) {
        const defaultExecutable = AdeRegistry.getExecutableByName(this.application.name);
        const instance =
            executable instanceof Executable
                ? executable
                : new Executable(executable ?? defaultExecutable.toJSON());

        this.allowedResults = instance.results;
        this.allowedMonitors = instance.monitors;
        this.allowedPostProcessors = instance.postProcessors;

        this.setProp("executable", instance.toJSON());
        this.setFlavor(flavor);
    }

    setFlavor(flavor?: Flavor | FlavorSchema) {
        const defaultFlavor = AdeRegistry.getFlavorByConfig(this.executableInstance);
        const instance =
            flavor instanceof Flavor ? flavor : new Flavor(flavor ?? defaultFlavor?.toJSON());

        if (!instance) {
            throw new Error("Flavor is not found for executable");
        }

        this.flavorInstance = instance;
        this.defaultMonitors = instance.monitors;
        this.defaultResults = instance.results;
        this.defaultPostProcessors = instance.postProcessors;

        this.setProp("flavor", instance.toJSON());
        this.setRuntimeItemsToDefaultValues();
        this.setDefaultInput();
    }

    setDefaultInput() {
        const inputs = AdeRegistry.getInput(this.flavorInstance);
        this.inputInstances = inputs.map(ExecutionUnitInput.createFromTemplate);
    }

    get allContextProviders() {
        return this.inputInstances.map((input) => input.contextProvidersInstances).flat();
    }

    get contextProviders() {
        return this.allContextProviders.filter((p) => p.entityName === "unit");
    }

    /** Update rendering context and persistent context
     * Note: this function is sometimes being called without passing a context!
     */
    render(context: AnyObject = {}) {
        this.renderingContext = { ...this.renderingContext, ...context };

        const newInput: ExecutionUnitInputItemSchema[] = [];
        const newPersistentContext: ContextItem[] = [];
        const newRenderingContext: ContextItem[] = [];

        this.inputInstances.forEach((input) => {
            input.setContext(this.renderingContext);
            input.render();

            const inputJSON = input.toJSON();
            const context = input.getFullContext();

            newInput.push(inputJSON);
            newRenderingContext.push(...context);
            newPersistentContext.push(...context.filter((c) => c.isEdited));
        });

        this.input = newInput;
        this.renderingContext = newRenderingContext;
        this.context = newPersistentContext;
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

    // toJSON() {
    //     const json = super.toJSON() as ExecutionUnitSchemaBase & AnyObject;

    //     // Remove results from executable; TODO: why do we need this?
    //     if (json.executable) {
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         const { results: _, ...executable } = json.executable;

    //         return {
    //             ...json,
    //             executable: {
    //                 ...executable,
    //             },
    //         };
    //     }

    //     return json;
    // }
}

executionUnitSchemaMixin(ExecutionUnit.prototype);
contextMixin(ExecutionUnit.prototype);
importantSettingsProviderMixin(ExecutionUnit.prototype);
