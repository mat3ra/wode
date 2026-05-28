"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeItemsUILogicMixin = runtimeItemsUILogicMixin;
// @ts-expect-error
const propertiesMixn = {
    setRuntimeItemsToDefaultValues() {
        this.results = this.defaultResults;
        this.monitors = this.defaultMonitors;
        this.preProcessors = this.defaultPreProcessors;
        this.postProcessors = this.defaultPostProcessors;
    },
    _initRuntimeItems(config) {
        this.results = (config === null || config === void 0 ? void 0 : config.results) || this.defaultResults;
        this.monitors = (config === null || config === void 0 ? void 0 : config.monitors) || this.defaultMonitors;
        this.preProcessors = (config === null || config === void 0 ? void 0 : config.preProcessors) || this.defaultPreProcessors;
        this.postProcessors = (config === null || config === void 0 ? void 0 : config.postProcessors) || this.defaultPostProcessors;
    },
    toggleRuntimeItem(key, data, isAdding) {
        if (isAdding) {
            this[key] = [...this[key], data];
        }
        else {
            this[key] = this[key].filter((x) => x.name !== data.name);
        }
    },
    toggleResult(data, isAdding) {
        this.toggleRuntimeItem("results", data, isAdding);
    },
    toggleMonitor(data, isAdding) {
        this.toggleRuntimeItem("monitors", data, isAdding);
    },
    togglePreProcessor(data, isAdding) {
        this.toggleRuntimeItem("preProcessors", data, isAdding);
    },
    togglePostProcessor(data, isAdding) {
        this.toggleRuntimeItem("postProcessors", data, isAdding);
    },
    get resultNames() {
        return this.results.map((r) => r.name);
    },
    get monitorNames() {
        return this.monitors.map((r) => r === null || r === void 0 ? void 0 : r.name);
    },
    get postProcessorNames() {
        return this.postProcessors.map((r) => r.name);
    },
    get preProcessorNames() {
        return this.preProcessors.map((r) => r.name);
    },
    getResultByName(name) {
        return this.results.find((r) => r.name === name);
    },
};
function runtimeItemsUILogicMixin(item) {
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(propertiesMixn));
}
