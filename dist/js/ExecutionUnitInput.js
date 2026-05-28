"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ade_1 = require("@mat3ra/ade");
const entity_1 = require("@mat3ra/code/dist/js/entity");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const providers_1 = require("./context/providers");
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
        this.contextProvidersInstances = [];
        this.templateInstance = templateInstance;
    }
    setContext(context) {
        this.contextProvidersInstances = this.template.contextProviders.map(({ name }) => {
            if (!providers_1.providers) {
                throw new Error("Providers config not set");
            }
            const ContextProvider = providers_1.providers[name];
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
        const rendered = nunjucks_1.default.compile(this.template.content).render(fullContext);
        this.rendered = rendered || this.template.content;
        return this;
    }
    getFullContext() {
        return this.contextProvidersInstances.map((contextProvider) => {
            return contextProvider.getContextItem();
        });
    }
}
exports.default = ExecutionUnitInput;
