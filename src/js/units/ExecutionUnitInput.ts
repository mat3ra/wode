import { Template } from "@mat3ra/ade";
import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { setupNunjucksEnvironment } from "@mat3ra/standata";
import nunjucks from "nunjucks";

import {
    type ExecutionUnitInputSchemaMixin,
    executionUnitInputSchemaMixin,
} from "../generated/ExecutionUnitInputSchemaMixin";

type Schema = ExecutionUnitInputSchemaMixin;
type JSON = Schema & AnyObject;
type ConstructorConfig = Schema | (Omit<Schema, "template"> & { template: Template });

const env = setupNunjucksEnvironment(new nunjucks.Environment());

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExecutionUnitInput extends ExecutionUnitInputSchemaMixin {}

class ExecutionUnitInput extends InMemoryEntity implements Schema {
    declare _json: JSON;

    declare toJSON: () => JSON;

    declare toJSONQuick: () => JSON;

    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow/unit/input/-inputItem");
    }

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
    }

    render(renderingContext: Record<string, unknown>) {
        if (this.isManuallyChanged) {
            return this;
        }

        try {
            const rendered = nunjucks.compile(this.template.content, env).render(renderingContext);

            this.rendered = rendered || this.template.content;

            return this;
        } catch (error) {
            console.error("Error rendering template", this.template.content);
            console.error("Rendering context: ", JSON.stringify(renderingContext));
            console.error("Error", error);
            throw error;
        }
    }
}

executionUnitInputSchemaMixin(ExecutionUnitInput.prototype);

export default ExecutionUnitInput;
