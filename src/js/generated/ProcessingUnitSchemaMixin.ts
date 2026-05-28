import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { ProcessingUnitMixinSchema } from "@mat3ra/esse/dist/js/types";

export type ProcessingUnitSchemaMixin = ProcessingUnitMixinSchema;

export type ProcessingUnitInMemoryEntity = InMemoryEntity & ProcessingUnitSchemaMixin;

export function processingUnitSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & ProcessingUnitSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & ProcessingUnitSchemaMixin = {
        get type() {
            return this.prop<ProcessingUnitMixinSchema["type"]>("type");
        },
        set type(value: ProcessingUnitMixinSchema["type"]) {
            this.setProp("type", value);
        },
        get operation() {
            return this.requiredProp<ProcessingUnitMixinSchema["operation"]>("operation");
        },
        set operation(value: ProcessingUnitMixinSchema["operation"]) {
            this.setProp("operation", value);
        },
        get operationType() {
            return this.requiredProp<ProcessingUnitMixinSchema["operationType"]>("operationType");
        },
        set operationType(value: ProcessingUnitMixinSchema["operationType"]) {
            this.setProp("operationType", value);
        },
        get inputData() {
            return this.requiredProp<ProcessingUnitMixinSchema["inputData"]>("inputData");
        },
        set inputData(value: ProcessingUnitMixinSchema["inputData"]) {
            this.setProp("inputData", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
