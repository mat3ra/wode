import { Template } from "@mat3ra/ade";
import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { type ExecutionUnitInputSchemaMixin } from "../generated/ExecutionUnitInputSchemaMixin";
type Schema = ExecutionUnitInputSchemaMixin;
type ExecutionUnitInputEntity = Schema & BaseInMemoryEntitySchema;
type ConstructorConfig = Schema | (Omit<Schema, "template"> & {
    template: Template;
});
interface ExecutionUnitInput extends ExecutionUnitInputSchemaMixin {
}
declare class ExecutionUnitInput extends InMemoryEntity<ExecutionUnitInputEntity> implements Schema {
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    static createFromTemplate(template: Template | TemplateSchema): ExecutionUnitInput;
    constructor(config: ConstructorConfig);
    render(renderingContext: Record<string, unknown>): this;
}
export default ExecutionUnitInput;
