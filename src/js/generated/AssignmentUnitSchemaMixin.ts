import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type {
    AssignmentUnitMixinSchema,
    BaseInMemoryEntitySchema,
} from "@mat3ra/esse/dist/js/types";

export type AssignmentUnitSchemaMixin = AssignmentUnitMixinSchema;

export type AssignmentUnitInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & AssignmentUnitSchemaMixin
>;

export function assignmentUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & AssignmentUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<AssignmentUnitSchemaMixin> & AssignmentUnitSchemaMixin = {
        get type() {
            return this.prop("type");
        },
        set type(value: AssignmentUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get input() {
            return this.prop("input");
        },
        set input(value: AssignmentUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
        get operand() {
            return this.requiredProp("operand");
        },
        set operand(value: AssignmentUnitMixinSchema["operand"]) {
            this.setProp("operand", value);
        },
        get value() {
            return this.requiredProp("value");
        },
        set value(value: AssignmentUnitMixinSchema["value"]) {
            this.setProp("value", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
