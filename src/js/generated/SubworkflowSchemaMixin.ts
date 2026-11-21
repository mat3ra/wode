import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, SubworkflowMixinSchema } from "@mat3ra/esse/dist/js/types";

export type SubworkflowSchemaMixin = SubworkflowMixinSchema;

export type SubworkflowInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & SubworkflowSchemaMixin
>;

export function subworkflowSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & SubworkflowSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<SubworkflowSchemaMixin> & SubworkflowSchemaMixin = {
        get properties() {
            return this.requiredProp("properties");
        },
        set properties(value: SubworkflowMixinSchema["properties"]) {
            this.setProp("properties", value);
        },
        get compute() {
            return this.prop("compute");
        },
        set compute(value: SubworkflowMixinSchema["compute"]) {
            this.setProp("compute", value);
        },
        get units() {
            return this.requiredProp("units");
        },
        set units(value: SubworkflowMixinSchema["units"]) {
            this.setProp("units", value);
        },
        get model() {
            return this.requiredProp("model");
        },
        set model(value: SubworkflowMixinSchema["model"]) {
            this.setProp("model", value);
        },
        get application() {
            return this.requiredProp("application");
        },
        set application(value: SubworkflowMixinSchema["application"]) {
            this.setProp("application", value);
        },
        get isMultiMaterial() {
            return this.prop("isMultiMaterial");
        },
        set isMultiMaterial(value: SubworkflowMixinSchema["isMultiMaterial"]) {
            this.setProp("isMultiMaterial", value);
        },
        get isDraft() {
            return this.prop("isDraft");
        },
        set isDraft(value: SubworkflowMixinSchema["isDraft"]) {
            this.setProp("isDraft", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
