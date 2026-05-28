import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ExecutionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ExecutionUnitSchemaMixin = ExecutionUnitMixinSchema;

export type ExecutionUnitInMemoryEntity = InMemoryEntity & ExecutionUnitSchemaMixin;

export function executionUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ExecutionUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & ExecutionUnitSchemaMixin = {
        get type() {
            return this.requiredProp<ExecutionUnitMixinSchema["type"]>("type");
        },
        set type(value: ExecutionUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get application() {
            return this.requiredProp<ExecutionUnitMixinSchema["application"]>("application");
        },
        set application(value: ExecutionUnitMixinSchema["application"]) {
            this.setProp("application", value);
        },
        get executable() {
            return this.requiredProp<ExecutionUnitMixinSchema["executable"]>("executable");
        },
        set executable(value: ExecutionUnitMixinSchema["executable"]) {
            this.setProp("executable", value);
        },
        get flavor() {
            return this.requiredProp<ExecutionUnitMixinSchema["flavor"]>("flavor");
        },
        set flavor(value: ExecutionUnitMixinSchema["flavor"]) {
            this.setProp("flavor", value);
        },
        get input() {
            return this.requiredProp<ExecutionUnitMixinSchema["input"]>("input");
        },
        set input(value: ExecutionUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
        get context() {
            return this.requiredProp<ExecutionUnitMixinSchema["context"]>("context");
        },
        set context(value: ExecutionUnitMixinSchema["context"]) {
            this.setProp("context", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
