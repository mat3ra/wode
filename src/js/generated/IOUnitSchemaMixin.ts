import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { DataIOUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type IOUnitSchemaMixin = DataIOUnitMixinSchema;

export type IOUnitInMemoryEntity = InMemoryEntity & IOUnitSchemaMixin;

export function iOUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & IOUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & IOUnitSchemaMixin = {
        get type() {
            return this.prop<DataIOUnitMixinSchema["type"]>("type");
        },
        set type(value: DataIOUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get subtype() {
            return this.requiredProp<DataIOUnitMixinSchema["subtype"]>("subtype");
        },
        set subtype(value: DataIOUnitMixinSchema["subtype"]) {
            this.setProp("subtype", value);
        },
        get source() {
            return this.requiredProp<DataIOUnitMixinSchema["source"]>("source");
        },
        set source(value: DataIOUnitMixinSchema["source"]) {
            this.setProp("source", value);
        },
        get input() {
            return this.requiredProp<DataIOUnitMixinSchema["input"]>("input");
        },
        set input(value: DataIOUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
