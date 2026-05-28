import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { WorkflowBaseUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type BaseUnitSchemaMixin = WorkflowBaseUnitMixinSchema;

export type BaseUnitInMemoryEntity = InMemoryEntity & BaseUnitSchemaMixin;

export function baseUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & BaseUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & BaseUnitSchemaMixin = {
        get isDraft() {
            return this.prop<WorkflowBaseUnitMixinSchema["isDraft"]>("isDraft");
        },
        set isDraft(value: WorkflowBaseUnitMixinSchema["isDraft"]) {
            this.setProp("isDraft", value);
        },
        get type() {
            return this.requiredProp<WorkflowBaseUnitMixinSchema["type"]>("type");
        },
        set type(value: WorkflowBaseUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get name() {
            return this.prop<WorkflowBaseUnitMixinSchema["name"]>("name");
        },
        set name(value: WorkflowBaseUnitMixinSchema["name"]) {
            this.setProp("name", value);
        },
        get status() {
            return this.prop<WorkflowBaseUnitMixinSchema["status"]>("status");
        },
        set status(value: WorkflowBaseUnitMixinSchema["status"]) {
            this.setProp("status", value);
        },
        get head() {
            return this.prop<WorkflowBaseUnitMixinSchema["head"]>("head");
        },
        set head(value: WorkflowBaseUnitMixinSchema["head"]) {
            this.setProp("head", value);
        },
        get flowchartId() {
            return this.requiredProp<WorkflowBaseUnitMixinSchema["flowchartId"]>("flowchartId");
        },
        set flowchartId(value: WorkflowBaseUnitMixinSchema["flowchartId"]) {
            this.setProp("flowchartId", value);
        },
        get next() {
            return this.prop<WorkflowBaseUnitMixinSchema["next"]>("next");
        },
        set next(value: WorkflowBaseUnitMixinSchema["next"]) {
            this.setProp("next", value);
        },
        get enableRender() {
            return this.prop<WorkflowBaseUnitMixinSchema["enableRender"]>("enableRender");
        },
        set enableRender(value: WorkflowBaseUnitMixinSchema["enableRender"]) {
            this.setProp("enableRender", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
