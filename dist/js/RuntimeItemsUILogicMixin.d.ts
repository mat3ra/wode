import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { RuntimeItems } from "@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { RuntimeItemsSchema } from "@mat3ra/esse/dist/js/types";
type ItemKey = "results" | "monitors" | "preProcessors" | "postProcessors";
export type RuntimeItemsUILogic = {
    setRuntimeItemsToDefaultValues(): void;
    _initRuntimeItems(config?: Partial<RuntimeItemsSchema>): void;
    toggleRuntimeItem(key: ItemKey, data: NameResultSchema, isAdding: boolean): void;
    toggleResult(data: NameResultSchema, isAdding: boolean): void;
    toggleMonitor(data: NameResultSchema, isAdding: boolean): void;
    togglePreProcessor(data: NameResultSchema, isAdding: boolean): void;
    togglePostProcessor(data: NameResultSchema, isAdding: boolean): void;
    getResultByName(name: string): NameResultSchema | undefined;
    get resultNames(): string[];
    get monitorNames(): string[];
    get postProcessorNames(): string[];
    get preProcessorNames(): string[];
};
type Base = InMemoryEntity & RuntimeItems & {
    defaultResults: NameResultSchema[];
    defaultMonitors: NameResultSchema[];
    defaultPreProcessors: NameResultSchema[];
    defaultPostProcessors: NameResultSchema[];
};
export declare function runtimeItemsUILogicMixin<T extends Base>(item: T): void;
export {};
