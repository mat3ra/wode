import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { WorkflowBaseUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type BaseUnitSchemaMixin = WorkflowBaseUnitMixinSchema;

export type BaseUnitInMemoryEntity = InMemoryEntity & BaseUnitSchemaMixin;

export function baseUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & BaseUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<BaseUnitSchemaMixin> & BaseUnitSchemaMixin = {
        get isDraft() {
            return this.prop("isDraft");
        },
        set isDraft(value: WorkflowBaseUnitMixinSchema["isDraft"]) {
            this.setProp("isDraft", value);
        },
        get head() {
            return this.prop("head");
        },
        set head(value: WorkflowBaseUnitMixinSchema["head"]) {
            this.setProp("head", value);
        },
        get flowchartId() {
            return this.requiredProp("flowchartId");
        },
        set flowchartId(value: WorkflowBaseUnitMixinSchema["flowchartId"]) {
            this.setProp("flowchartId", value);
        },
        get next() {
            return this.prop("next");
        },
        set next(value: WorkflowBaseUnitMixinSchema["next"]) {
            this.setProp("next", value);
        },
        get enableRender() {
            return this.prop("enableRender");
        },
        set enableRender(value: WorkflowBaseUnitMixinSchema["enableRender"]) {
            this.setProp("enableRender", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
