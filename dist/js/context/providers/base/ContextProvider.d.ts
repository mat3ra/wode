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
export type Domain = "executable" | "important";
export type EntityName = "unit" | "subworkflow";
/** Minimal bound for provider external context; the full contract is ExternalContext in context/providers/index.ts */
export type BaseExternalContext = object;
declare abstract class ContextProvider<S extends ContextItemSchema = ContextItemSchema, EC extends BaseExternalContext = BaseExternalContext> {
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
    getContextItemData(): S;
    /**
     * Helper method to find a context item from a unit context array by name.
     * Returns a partial schema object that can be safely passed to constructors.
     */
    protected static findContextItem<S extends ContextItemSchema>(unitContext: UnitContext, contextName: ContextName): Partial<S>;
}
export default ContextProvider;
