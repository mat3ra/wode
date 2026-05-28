import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ExecutionUnitInputItemSchema } from "@mat3ra/esse/dist/js/types";

export type ExecutionUnitInputSchemaMixin = ExecutionUnitInputItemSchema;

export type ExecutionUnitInputInMemoryEntity = InMemoryEntity & ExecutionUnitInputSchemaMixin;

export function executionUnitInputSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ExecutionUnitInputSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & ExecutionUnitInputSchemaMixin = {
        get template() {
            return this.requiredProp<ExecutionUnitInputItemSchema["template"]>("template");
        },
        set template(value: ExecutionUnitInputItemSchema["template"]) {
            this.setProp("template", value);
        },
        get rendered() {
            return this.requiredProp<ExecutionUnitInputItemSchema["rendered"]>("rendered");
        },
        set rendered(value: ExecutionUnitInputItemSchema["rendered"]) {
            this.setProp("rendered", value);
        },
        get isManuallyChanged() {
            return this.requiredProp<ExecutionUnitInputItemSchema["isManuallyChanged"]>(
                "isManuallyChanged",
            );
        },
        set isManuallyChanged(value: ExecutionUnitInputItemSchema["isManuallyChanged"]) {
            this.setProp("isManuallyChanged", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
