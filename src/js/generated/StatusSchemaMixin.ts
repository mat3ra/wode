import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { StatusSchema } from "@mat3ra/esse/dist/js/types";

export type StatusSchemaMixin = StatusSchema;

export type StatusInMemoryEntity = InMemoryEntity & StatusSchemaMixin;

export function statusSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & StatusSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<StatusSchemaMixin> & StatusSchemaMixin = {
        get status() {
            return this.prop("status");
        },
        set status(value: StatusSchema["status"]) {
            this.setProp("status", value);
        },
        get statusTrack() {
            return this.prop("statusTrack");
        },
        set statusTrack(value: StatusSchema["statusTrack"]) {
            this.setProp("statusTrack", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
