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

type RuntimeItemsUILogicPrivate = {
    toggleRuntimeItem(key: ItemKey, data: NameResultSchema, isAdding: boolean): void;
};

type Base = InMemoryEntity &
    RuntimeItems & {
        defaultResults: NameResultSchema[];
        defaultMonitors: NameResultSchema[];
        defaultPreProcessors: NameResultSchema[];
        defaultPostProcessors: NameResultSchema[];
    };

// @ts-expect-error
const propertiesMixn: Base & RuntimeItemsUILogic & RuntimeItemsUILogicPrivate = {
    setRuntimeItemsToDefaultValues() {
        this.results = this.defaultResults;
        this.monitors = this.defaultMonitors;
        this.preProcessors = this.defaultPreProcessors;
        this.postProcessors = this.defaultPostProcessors;
    },
    _initRuntimeItems(config) {
        this.results = config?.results || this.defaultResults;
        this.monitors = config?.monitors || this.defaultMonitors;
        this.preProcessors = config?.preProcessors || this.defaultPreProcessors;
        this.postProcessors = config?.postProcessors || this.defaultPostProcessors;
    },
    toggleRuntimeItem(key: ItemKey, data: NameResultSchema, isAdding: boolean) {
        if (isAdding) {
            this[key] = [...this[key], data];
        } else {
            this[key] = this[key].filter((x) => x.name !== data.name);
        }
    },
    toggleResult(data: NameResultSchema, isAdding: boolean) {
        this.toggleRuntimeItem("results", data, isAdding);
    },
    toggleMonitor(data: NameResultSchema, isAdding: boolean) {
        this.toggleRuntimeItem("monitors", data, isAdding);
    },
    togglePreProcessor(data: NameResultSchema, isAdding: boolean) {
        this.toggleRuntimeItem("preProcessors", data, isAdding);
    },
    togglePostProcessor(data: NameResultSchema, isAdding: boolean) {
        this.toggleRuntimeItem("postProcessors", data, isAdding);
    },
    get resultNames() {
        return this.results.map((r) => r.name);
    },
    get monitorNames() {
        return this.monitors.map((r) => r?.name);
    },
    get postProcessorNames() {
        return this.postProcessors.map((r) => r.name);
    },
    get preProcessorNames() {
        return this.preProcessors.map((r) => r.name);
    },
    getResultByName(name: string) {
        return this.results.find((r) => r.name === name);
    },
};

export function runtimeItemsUILogicMixin<T extends Base>(item: T) {
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(propertiesMixn));
}
