import { Template } from "@mat3ra/ade";
import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";
import nunjucks from "nunjucks";

import { providers } from "./context/providers";
import type { ContextItem, ContextProviderConfig } from "./context/providers/base/ContextProvider";
import type ContextProvider from "./context/providers/base/ContextProvider";
import type { ExecutionUnitInputSchemaMixin } from "./generated/ExecutionUnitInputSchemaMixin";

type Schema = ExecutionUnitInputSchemaMixin;

type Base = typeof InMemoryEntity & Constructor<ExecutionUnitInputSchemaMixin>;

type ConstructorConfig = Schema | (Omit<Schema, "template"> & { template: Template });

export default class ExecutionUnitInput extends (InMemoryEntity as Base) implements Schema {
    declare _json: Schema & AnyObject;

    declare toJSON: () => Schema & AnyObject;

    declare toJSONQuick: () => Schema & AnyObject;

    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/input/-inputItem");
    }

    contextProvidersInstances: ContextProvider[] = [];

    readonly templateInstance: Template;

    static createFromTemplate(template: Template | TemplateSchema) {
        return new ExecutionUnitInput({
            template,
            rendered: template.content,
            isManuallyChanged: false,
        });
    }

    constructor(config: ConstructorConfig) {
        const { template } = config;
        const templateInstance = template instanceof Template ? template : new Template(template);

        super({ ...config, template: templateInstance.toJSON() });

        this.templateInstance = templateInstance;
    }

    setContext(context: ContextItem[]) {
        this.contextProvidersInstances = this.template.contextProviders.map(({ name }) => {
            if (!providers) {
                throw new Error("Providers config not set");
            }

            const ContextProvider = providers[name as keyof typeof providers];
            const contextItem = context.find((c) => c.name === name);

            if (!contextItem) {
                throw new Error(`Context item for provider ${name} not found`);
            }

            return new ContextProvider(contextItem);
        });

        return this;
    }

    render() {
        if (this.isManuallyChanged) {
            return this;
        }

        const fullContext = this.getFullContext();
        const rendered = nunjucks.compile(this.template.content).render(fullContext);

        this.rendered = rendered || this.template.content;

        return this;
    }

    getFullContext() {
        return this.contextProvidersInstances.map((contextProvider) => {
            return contextProvider.getContextItem();
        });
    }
}
