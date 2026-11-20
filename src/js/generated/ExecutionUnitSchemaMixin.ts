import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type {
    BaseInMemoryEntitySchema,
    ExecutionUnitMixinSchema,
} from "@mat3ra/esse/dist/js/types";

export type ExecutionUnitSchemaMixin = ExecutionUnitMixinSchema;

export type ExecutionUnitInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & ExecutionUnitSchemaMixin
>;

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
            this.setProp(
                "application",
                value instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(value) : value,
            );
        },
        get executable() {
            return this.requiredProp("executable");
        },
        set executable(value: ExecutionUnitMixinSchema["executable"]) {
            this.setProp(
                "executable",
                value instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(value) : value,
            );
        },
        get flavor() {
            return this.requiredProp("flavor");
        },
        set flavor(value: ExecutionUnitMixinSchema["flavor"]) {
            this.setProp(
                "flavor",
                value instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(value) : value,
            );
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value: ExecutionUnitMixinSchema["input"]) {
            this.setProp(
                "input",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
        get context() {
            return this.requiredProp("context");
        },
        set context(value: ExecutionUnitMixinSchema["context"]) {
            this.setProp(
                "context",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
