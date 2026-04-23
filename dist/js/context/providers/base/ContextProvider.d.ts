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
declare abstract class ContextProvider<S extends ContextItemSchema = ContextItemSchema, EC extends BaseExternalContext = BaseExternalContext, 
/** Data passed to templates; defaults to persisted `S["data"]` (identity `patchForRendering`). */
DataForRendering = S["data"]> {
    abstract name: S["name"];
    abstract readonly domain: Domain;
    abstract readonly entityName: EntityName;
    protected abstract getDefaultData(): S["data"];
    protected data?: S["data"];
    abstract extraData: S["extraData"];
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
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    protected static findContextItem<S extends ContextItemSchema>(unitContext: UnitContext, contextName: ContextName): Partial<S>;
}
export default ContextProvider;
