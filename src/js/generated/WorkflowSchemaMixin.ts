import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, BaseWorkflowSchema } from "@mat3ra/esse/dist/js/types";

export type WorkflowSchemaMixin = BaseWorkflowSchema;

export type WorkflowInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & WorkflowSchemaMixin>;

export function workflowSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & WorkflowSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<WorkflowSchemaMixin> & WorkflowSchemaMixin = {
        get properties() {
            return this.requiredProp("properties");
        },
        set properties(value: BaseWorkflowSchema["properties"]) {
            this.setProp(
                "properties",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
        get isUsingDataset() {
            return this.prop("isUsingDataset");
        },
        set isUsingDataset(value: BaseWorkflowSchema["isUsingDataset"]) {
            this.setProp("isUsingDataset", value);
        },
        get isMultiMaterial() {
            return this.prop("isMultiMaterial");
        },
        set isMultiMaterial(value: BaseWorkflowSchema["isMultiMaterial"]) {
            this.setProp("isMultiMaterial", value);
        },
        get subworkflows() {
            return this.requiredProp("subworkflows");
        },
        set subworkflows(value: BaseWorkflowSchema["subworkflows"]) {
            this.setProp(
                "subworkflows",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
        get units() {
            return this.requiredProp("units");
        },
        set units(value: BaseWorkflowSchema["units"]) {
            this.setProp(
                "units",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
        get application() {
            return this.prop("application");
        },
        set application(value: BaseWorkflowSchema["application"]) {
            this.setProp(
                "application",
                value instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(value) : value,
            );
        },
        get tags() {
            return this.prop("tags");
        },
        set tags(value: BaseWorkflowSchema["tags"]) {
            this.setProp(
                "tags",
                value?.map((item: unknown) =>
                    item instanceof InMemoryEntity ? InMemoryEntity.getDataForEntity(item) : item,
                ),
            );
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
