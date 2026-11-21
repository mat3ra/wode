import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, StatusTrackSchema } from "@mat3ra/esse/dist/js/types";

export type StatusTrackSchemaMixin = StatusTrackSchema;

export type StatusTrackInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & StatusTrackSchemaMixin
>;

export function statusTrackSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & StatusTrackSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<StatusTrackSchemaMixin> & StatusTrackSchemaMixin = {
        get statusTrack() {
            return this.prop("statusTrack");
        },
        set statusTrack(value: StatusTrackSchema["statusTrack"]) {
            this.setProp("statusTrack", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
