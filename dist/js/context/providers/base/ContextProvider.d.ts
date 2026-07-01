import { type ContextItemSchema } from "@mat3ra/esse/dist/js/types";
export type UnitContext = ContextItemSchema[];
export type ContextName = ContextItemSchema["name"];
export type ContextExtraData = ContextItemSchema["extraData"];
export type ContextData = ContextItemSchema["data"];
export type ContextItem<D extends ContextData = ContextData, ED extends ContextExtraData = ContextExtraData> = {
    data?: D;
    extraData?: ED;
    isEdited?: boolean;
};
/** Context item with template-facing `data` (may be a superset of persisted `S["data"]`). */
export type ContextItemForRendering<S extends ContextItemSchema = ContextItemSchema, R = S["data"]> = Omit<S, "data"> & {
    data: R;
};
export type Domain = "executable" | "important";
export type EntityName = "unit" | "subworkflow";
/** Minimal bound for provider external context; the full contract is ExternalContext in context/providers/index.ts */
export type BaseExternalContext = object;
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
declare abstract class ContextProvider<S extends ContextItemSchema = ContextItemSchema, EC extends BaseExternalContext = BaseExternalContext, 
/** Data passed to templates; defaults to persisted `S["data"]` (identity `patchForRendering`). */
DataForRendering = S["data"]> {
    abstract name: S["name"];
    abstract readonly domain: Domain;
    abstract readonly entityName: EntityName;
    protected abstract getDefaultData(): S["data"];
    protected data?: S["data"];
    /** Seeded from persisted context; material providers refresh via `updateMaterialHash()`. */
    extraData?: S["extraData"];
    readonly externalContext: EC;
    isEdited: boolean;
    constructor(contextItem: Partial<S>, externalContext: EC);
    setIsEdited(isEdited: boolean): void;
    getData(): S["data"];
    setData(data: S["data"]): void;
    /**
     * Derive template-facing `data` from persisted `data`. Override when the template needs fields
     * that must not be stored (e.g. coordinates from symmetry point names + lattice).
     */
    protected patchForRendering(data: S["data"]): DataForRendering;
    getDataForRendering(): DataForRendering;
    getContextItemData(): S;
    getContextItemDataForRendering(): ContextItemForRendering<S, DataForRendering>;
    /**
     * Grid providers override to resolve templated `dimensions` from `scope.global`.
     */
    renderContext(_scopeGlobal: Record<string, unknown>): boolean;
    /**
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    protected static findContextItem<S extends ContextItemSchema>(unitContext: UnitContext, contextName: ContextName): Partial<S>;
}
export default ContextProvider;
