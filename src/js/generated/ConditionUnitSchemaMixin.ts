import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ConditionUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ConditionUnitSchemaMixin = ConditionUnitMixinSchema;

export type ConditionUnitInMemoryEntity = InMemoryEntity & ConditionUnitSchemaMixin;

export function conditionUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ConditionUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & ConditionUnitSchemaMixin = {
        get type() {
            return this.prop<ConditionUnitMixinSchema["type"]>("type");
        },
        set type(value: ConditionUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get input() {
            return this.requiredProp<ConditionUnitMixinSchema["input"]>("input");
        },
        set input(value: ConditionUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
        get statement() {
            return this.requiredProp<ConditionUnitMixinSchema["statement"]>("statement");
        },
        set statement(value: ConditionUnitMixinSchema["statement"]) {
            this.setProp("statement", value);
        },
        get then() {
            return this.requiredProp<ConditionUnitMixinSchema["then"]>("then");
        },
        set then(value: ConditionUnitMixinSchema["then"]) {
            this.setProp("then", value);
        },
        get else() {
            return this.requiredProp<ConditionUnitMixinSchema["else"]>("else");
        },
        set else(value: ConditionUnitMixinSchema["else"]) {
            this.setProp("else", value);
        },
        get maxOccurrences() {
            return this.requiredProp<ConditionUnitMixinSchema["maxOccurrences"]>("maxOccurrences");
        },
        set maxOccurrences(value: ConditionUnitMixinSchema["maxOccurrences"]) {
            this.setProp("maxOccurrences", value);
        },
        get throwException() {
            return this.prop<ConditionUnitMixinSchema["throwException"]>("throwException");
        },
        set throwException(value: ConditionUnitMixinSchema["throwException"]) {
            this.setProp("throwException", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
