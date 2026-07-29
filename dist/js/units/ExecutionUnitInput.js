"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ade_1 = require("@mat3ra/ade");
const entity_1 = require("@mat3ra/code/dist/js/entity");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const standata_1 = require("@mat3ra/standata");
const nunjucks_1 = __importDefault(require("nunjucks"));
const ExecutionUnitInputSchemaMixin_1 = require("../generated/ExecutionUnitInputSchemaMixin");
const env = (0, standata_1.setupNunjucksEnvironment)(new nunjucks_1.default.Environment());
class ExecutionUnitInput extends entity_1.InMemoryEntity {
    static get jsonSchema() {
        return JSONSchemasInterface_1.default.getSchemaById("workflow/unit/input/-inputItem");
    }
    static createFromTemplate(template) {
        return new ExecutionUnitInput({
            template,
            rendered: template.content,
            isManuallyChanged: false,
        });
    }
    constructor(config) {
        const { template } = config;
        const templateInstance = template instanceof ade_1.Template ? template : new ade_1.Template(template);
        super({ ...config, template: templateInstance.toJSON() });
    }
    render(renderingContext) {
        if (this.isManuallyChanged) {
            return this;
        }
        try {
            const rendered = nunjucks_1.default.compile(this.template.content, env).render(renderingContext);
            this.rendered = rendered || this.template.content;
        }
        catch (error) {
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
(0, ExecutionUnitInputSchemaMixin_1.executionUnitInputSchemaMixin)(ExecutionUnitInput.prototype);
exports.default = ExecutionUnitInput;
