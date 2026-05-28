import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { SubworkflowMixinSchema } from "@mat3ra/esse/dist/js/types";

export type SubworkflowSchemaMixin = SubworkflowMixinSchema;

export type SubworkflowInMemoryEntity = InMemoryEntity & SubworkflowSchemaMixin;

export function subworkflowSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & SubworkflowSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & SubworkflowSchemaMixin = {
        get properties() {
            return this.prop<SubworkflowMixinSchema["properties"]>("properties");
        },
        set properties(value: SubworkflowMixinSchema["properties"]) {
            this.setProp("properties", value);
        },
        get compute() {
            return this.prop<SubworkflowMixinSchema["compute"]>("compute");
        },
        set compute(value: SubworkflowMixinSchema["compute"]) {
            this.setProp("compute", value);
        },
        get units() {
            return this.requiredProp<SubworkflowMixinSchema["units"]>("units");
        },
        set units(value: SubworkflowMixinSchema["units"]) {
            this.setProp("units", value);
        },
        get model() {
            return this.requiredProp<SubworkflowMixinSchema["model"]>("model");
        },
        set model(value: SubworkflowMixinSchema["model"]) {
            this.setProp("model", value);
        },
        get application() {
            return this.requiredProp<SubworkflowMixinSchema["application"]>("application");
        },
        set application(value: SubworkflowMixinSchema["application"]) {
            this.setProp("application", value);
        },
        get isDraft() {
            return this.prop<SubworkflowMixinSchema["isDraft"]>("isDraft");
        },
        set isDraft(value: SubworkflowMixinSchema["isDraft"]) {
            this.setProp("isDraft", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
