import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ExecutionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ExecutionUnitSchemaMixin = ExecutionUnitMixinSchema;

export type ExecutionUnitInMemoryEntity = InMemoryEntity & ExecutionUnitSchemaMixin;

export function executionUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ExecutionUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<ExecutionUnitSchemaMixin> & ExecutionUnitSchemaMixin = {
        get type() {
            return this.requiredProp("type");
        },
        set type(value: ExecutionUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get application() {
            return this.requiredProp("application");
        },
        set application(value: ExecutionUnitMixinSchema["application"]) {
            this.setProp("application", value);
        },
        get executable() {
            return this.requiredProp("executable");
        },
        set executable(value: ExecutionUnitMixinSchema["executable"]) {
            this.setProp("executable", value);
        },
        get flavor() {
            return this.requiredProp("flavor");
        },
        set flavor(value: ExecutionUnitMixinSchema["flavor"]) {
            this.setProp("flavor", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value: ExecutionUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
        get context() {
            return this.requiredProp("context");
        },
        set context(value: ExecutionUnitMixinSchema["context"]) {
            this.setProp("context", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
