import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { MapUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type MapUnitSchemaMixin = MapUnitMixinSchema;

export type MapUnitInMemoryEntity = InMemoryEntity & MapUnitSchemaMixin;

export function mapUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & MapUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<MapUnitSchemaMixin> & MapUnitSchemaMixin = {
        get type() {
            return this.prop("type");
        },
        set type(value: MapUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get workflowId() {
            return this.requiredProp("workflowId");
        },
        set workflowId(value: MapUnitMixinSchema["workflowId"]) {
            this.setProp("workflowId", value);
        },
        get input() {
            return this.requiredProp("input");
        },
        set input(value: MapUnitMixinSchema["input"]) {
            this.setProp("input", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
