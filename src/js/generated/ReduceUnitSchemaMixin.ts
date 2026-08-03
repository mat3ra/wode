import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, ReduceUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ReduceUnitSchemaMixin = ReduceUnitMixinSchema;

export type ReduceUnitInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & ReduceUnitSchemaMixin
>;

export function reduceUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ReduceUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<ReduceUnitSchemaMixin> & ReduceUnitSchemaMixin = {
        get type() {
            return this.prop("type");
        },
        set type(value: ReduceUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get mapFlowchartId() {
            return this.requiredProp("mapFlowchartId");
        },
        set mapFlowchartId(value: ReduceUnitMixinSchema["mapFlowchartId"]) {
            this.setProp("mapFlowchartId", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value: ReduceUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
