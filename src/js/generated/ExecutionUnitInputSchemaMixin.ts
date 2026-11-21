import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type {
    BaseInMemoryEntitySchema,
    ExecutionUnitInputItemSchema,
} from "@mat3ra/esse/dist/js/types";

export type ExecutionUnitInputSchemaMixin = ExecutionUnitInputItemSchema;

export type ExecutionUnitInputInMemoryEntity = InMemoryEntity<
    BaseInMemoryEntitySchema & ExecutionUnitInputSchemaMixin
>;

export function executionUnitInputSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ExecutionUnitInputSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity<ExecutionUnitInputSchemaMixin> &
        ExecutionUnitInputSchemaMixin = {
        get template() {
            return this.requiredProp("template");
        },
        set template(value: ExecutionUnitInputItemSchema["template"]) {
            this.setProp("template", value);
        },
        get rendered() {
            return this.prop("rendered");
        },
        set rendered(value: ExecutionUnitInputItemSchema["rendered"]) {
            this.setProp("rendered", value);
        },
        get isManuallyChanged() {
            return this.requiredProp("isManuallyChanged");
        },
        set isManuallyChanged(value: ExecutionUnitInputItemSchema["isManuallyChanged"]) {
            this.setProp("isManuallyChanged", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
