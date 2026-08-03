import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type {
    BaseInMemoryEntitySchema,
    SubworkflowUnitMixinSchema,
} from "@mat3ra/esse/dist/js/types";

export type SubworkflowUnitSchemaMixin = SubworkflowUnitMixinSchema;

export type SubworkflowUnitInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & SubworkflowUnitSchemaMixin
>;

export function subworkflowUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & SubworkflowUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<SubworkflowUnitSchemaMixin> & SubworkflowUnitSchemaMixin = {
        get type() {
            return this.prop("type");
        },
        set type(value: SubworkflowUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
