import { Template } from "@mat3ra/ade";
import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";
import type { ContextItem } from "./context/providers/base/ContextProvider";
import type ContextProvider from "./context/providers/base/ContextProvider";
import type { ExecutionUnitInputSchemaMixin } from "./generated/ExecutionUnitInputSchemaMixin";
type Schema = ExecutionUnitInputSchemaMixin;
type Base = typeof InMemoryEntity & Constructor<ExecutionUnitInputSchemaMixin>;
type ConstructorConfig = Schema | (Omit<Schema, "template"> & {
    template: Template;
});
declare const ExecutionUnitInput_base: Base;
export default class ExecutionUnitInput extends ExecutionUnitInput_base implements Schema {
    _json: Schema & AnyObject;
    toJSON: () => Schema & AnyObject;
    toJSONQuick: () => Schema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    contextProvidersInstances: ContextProvider[];
    readonly templateInstance: Template;
    static createFromTemplate(template: Template | TemplateSchema): ExecutionUnitInput;
    constructor(config: ConstructorConfig);
    setContext(context: ContextItem[]): this;
    render(): this;
    getFullContext(): import("./context/providers/base/ContextProvider").ExtendedContextItem<string, object, object>[];
}
export {};
