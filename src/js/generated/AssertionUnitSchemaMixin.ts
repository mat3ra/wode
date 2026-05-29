import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AssertionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type AssertionUnitSchemaMixin = AssertionUnitMixinSchema;

export type AssertionUnitInMemoryEntity = InMemoryEntity & AssertionUnitSchemaMixin;

export function assertionUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & AssertionUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & AssertionUnitSchemaMixin = {
        get type() {
            return this.prop<AssertionUnitMixinSchema["type"]>("type");
        },
        set type(value: AssertionUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get statement() {
            return this.requiredProp<AssertionUnitMixinSchema["statement"]>("statement");
        },
        set statement(value: AssertionUnitMixinSchema["statement"]) {
            this.setProp("statement", value);
        },
        get errorMessage() {
            return this.prop<AssertionUnitMixinSchema["errorMessage"]>("errorMessage");
        },
        set errorMessage(value: AssertionUnitMixinSchema["errorMessage"]) {
            this.setProp("errorMessage", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
