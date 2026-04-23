"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@mat3ra/utils");
/**
 * Context providers expose three data layers. Keep them separate.
 *
 *   1. Persistent data — user input / defaults. Stored in the DB as the context item's `data`,
 *      and bound to RJSForm as `formData`.
 *        API: `getData()` / `setData(data)` / `getContextItemData()`
 *
 *   2. Patched persistent (rendering) data — persistent data plus fields derived from external
 *      context (material, application, …) that must NOT be stored or shown in the form.
 *      Default = identity, override `patchForRendering` when the template needs extra fields.
 *        API: `getDataForRendering()` / `getContextItemDataForRendering()`
 *      If the rendering shape is a proper superset of the persistent shape, declare it via the
 *      third generic `DataForRendering` and pair with a dedicated ESSE schema (see
 *      `PointsPathFormDataProvider` + `points_path_data_provider_rendering.json`).
 *
 *   3. Full rendering context — `{ ...patchedItemByName, ...externalContext }` fed to Jinja.
 *      Built by `ExecutionUnit.render` from `getContextItemDataForRendering()` results.
 *
 * Rules:
 *   - Never bake derived fields into `setData`/`getDefaultData` just to reach templates.
 *   - `setData` may normalize legacy payloads to the current persistent schema.
 *   - `ExecutionUnit.render` MUST call `getContextItemData()` for `this.context` (DB) and
 *     `getContextItemDataForRendering()` for `this.renderingContext` (Jinja) separately.
 *
 * See `.cursor/rules/context-provider-data-layers.mdc` for the full guidance.
 */
class ContextProvider {
    constructor(contextItem, externalContext) {
        this.externalContext = externalContext;
        this.isEdited = contextItem.isEdited || false;
        if (contextItem.data) {
            this.setData(contextItem.data);
        }
    }
    setIsEdited(isEdited) {
        this.isEdited = isEdited;
    }
    getData() {
        return this.isEdited && this.data ? this.data : this.getDefaultData();
    }
    setData(data) {
        this.data = utils_1.Utils.clone.deepClone(data);
    }
    /**
     * Derive template-facing `data` from persisted `data`. Override when the template needs fields
     * that must not be stored (e.g. coordinates from symmetry point names + lattice).
     */
    // eslint-disable-next-line class-methods-use-this
    patchForRendering(data) {
        return data;
    }
    getDataForRendering() {
        return this.patchForRendering(this.getData());
    }
    getContextItemData() {
        return {
            name: this.name,
            isEdited: this.isEdited,
            data: this.getData(),
            extraData: this.extraData,
        };
    }
    getContextItemDataForRendering() {
        return {
            ...this.getContextItemData(),
            data: this.getDataForRendering(),
        };
    }
    /**
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    static findContextItem(unitContext, contextName) {
        const item = unitContext.find((item) => item.name === contextName);
        return item || {};
    }
}
exports.default = ContextProvider;
