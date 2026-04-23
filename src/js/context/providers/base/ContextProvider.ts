import { type ContextItemSchema } from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

export type UnitContext = ContextItemSchema[];
export type ContextName = ContextItemSchema["name"];
export type ContextExtraData = ContextItemSchema["extraData"];
export type ContextData = ContextItemSchema["data"];

export type ContextItem<
    D extends ContextData = ContextData,
    ED extends ContextExtraData = ContextExtraData,
> = {
    data?: D;
    extraData?: ED;
    isEdited?: boolean;
};

/** Context item with template-facing `data` (may be a superset of persisted `S["data"]`). */
export type ContextItemForRendering<
    S extends ContextItemSchema = ContextItemSchema,
    R = S["data"],
> = Omit<S, "data"> & { data: R };

export type Domain = "executable" | "important";

export type EntityName = "unit" | "subworkflow";

/** Minimal bound for provider external context; the full contract is ExternalContext in context/providers/index.ts */
export type BaseExternalContext = object;

abstract class ContextProvider<
    S extends ContextItemSchema = ContextItemSchema,
    EC extends BaseExternalContext = BaseExternalContext,
    /** Data passed to templates; defaults to persisted `S["data"]` (identity `patchForRendering`). */
    DataForRendering = S["data"],
> {
    abstract name: S["name"];

    abstract readonly domain: Domain;

    abstract readonly entityName: EntityName;

    protected abstract getDefaultData(): S["data"];

    protected data?: S["data"];

    abstract extraData: S["extraData"];

    readonly externalContext: EC;

    isEdited: boolean;

    constructor(contextItem: Partial<S>, externalContext: EC) {
        this.externalContext = externalContext;
        this.isEdited = contextItem.isEdited || false;

        if (contextItem.data) {
            this.setData(contextItem.data);
        }
    }

    setIsEdited(isEdited: boolean) {
        this.isEdited = isEdited;
    }

    getData() {
        return this.isEdited && this.data ? this.data : this.getDefaultData();
    }

    setData(data: S["data"]) {
        this.data = Utils.clone.deepClone(data);
    }

    /**
     * Derive template-facing `data` from persisted `data`. Override when the template needs fields
     * that must not be stored (e.g. coordinates from symmetry point names + lattice).
     */
    // eslint-disable-next-line class-methods-use-this
    protected patchForRendering(data: S["data"]): DataForRendering {
        return data as DataForRendering;
    }

    getDataForRendering(): DataForRendering {
        return this.patchForRendering(this.getData());
    }

    getContextItemData(): S {
        return {
            name: this.name,
            isEdited: this.isEdited,
            data: this.getData(),
            extraData: this.extraData,
        } as S;
    }

    getContextItemDataForRendering(): ContextItemForRendering<S, DataForRendering> {
        return {
            ...this.getContextItemData(),
            data: this.getDataForRendering(),
        };
    }

    /**
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    protected static findContextItem<S extends ContextItemSchema>(
        unitContext: UnitContext,
        contextName: ContextName,
    ): Partial<S> {
        const item = unitContext.find((item): item is S => item.name === contextName);
        return item || {};
    }
}

export default ContextProvider;
