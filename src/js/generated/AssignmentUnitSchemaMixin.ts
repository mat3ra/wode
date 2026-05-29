import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AssignmentUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type AssignmentUnitSchemaMixin = AssignmentUnitMixinSchema;

export type AssignmentUnitInMemoryEntity = InMemoryEntity & AssignmentUnitSchemaMixin;

export function assignmentUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & AssignmentUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & AssignmentUnitSchemaMixin = {
        get type() {
            return this.prop<AssignmentUnitMixinSchema["type"]>("type");
        },
        set type(value: AssignmentUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get input() {
            return this.prop<AssignmentUnitMixinSchema["input"]>("input");
        },
        set input(value: AssignmentUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
        get operand() {
            return this.requiredProp<AssignmentUnitMixinSchema["operand"]>("operand");
        },
        set operand(value: AssignmentUnitMixinSchema["operand"]) {
            this.setProp("operand", value);
        },
        get value() {
            return this.requiredProp<AssignmentUnitMixinSchema["value"]>("value");
        },
        set value(value: AssignmentUnitMixinSchema["value"]) {
            this.setProp("value", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
