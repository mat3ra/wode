import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ErrorUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ErrorUnitSchemaMixin = ErrorUnitMixinSchema;

export type ErrorUnitInMemoryEntity = InMemoryEntity & ErrorUnitSchemaMixin;

export function errorUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ErrorUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<ErrorUnitSchemaMixin> & ErrorUnitSchemaMixin = {
        get type() {
            return this.prop("type");
        },
        set type(value: ErrorUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get reason() {
            return this.requiredProp("reason");
        },
        set reason(value: ErrorUnitMixinSchema["reason"]) {
            this.setProp("reason", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
