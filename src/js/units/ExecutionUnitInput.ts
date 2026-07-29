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
        } catch (error) {
            // Can happen transiently right after switching to a multi-material workflow (e.g.
            // interface left/right units keyed by MATERIAL_INDEX "1"/"2"), before the job's
            // materials have been updated to match: `input.perMaterial[MATERIAL_INDEX]` is
            // undefined until enough materials are assigned. This throwing used to propagate out
            // of `ExecutionUnit.render()` and up through the JOB_WORKFLOW_SYNC/JOB_UPDATE
            // reducers, aborting the whole dispatch - so the workflow selection itself silently
            // never applied to the job (job-designer's `onSelectWorkflowsSubmit` just logs the
            // rejected promise). Fall back to the raw template so the reducer can complete;
            // render() runs again on the next job/material update and renders correctly once
            // materials line up.
            console.error("Error rendering template", this.template.content);
            console.error("Rendering context: ", JSON.stringify(renderingContext));
            console.error("Error", error);
            this.rendered = this.template.content;
        }

        return this;
    }
}

executionUnitInputSchemaMixin(ExecutionUnitInput.prototype);

export default ExecutionUnitInput;
