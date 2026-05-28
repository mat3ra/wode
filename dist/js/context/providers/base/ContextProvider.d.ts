import { ContextProviderSchema } from "@mat3ra/esse/dist/js/types";
export interface ContextProviderInstance {
    constructor: typeof ContextProvider;
    config: ContextProviderSchema;
}
export type ContextProviderConfig<N extends string = string, D extends object = object, ED extends object = object> = {
    name: N;
    data?: D;
    extraData?: ED;
    domain?: string;
    entityName?: EntityName;
    isEdited?: boolean;
};
export type ContextItem<D extends object = object, ED extends object = object> = {
    data?: D;
    extraData?: ED;
    isEdited?: boolean;
};
export type ExtendedContextItem<N extends string = string, D extends object = object, ED extends object = object> = ContextItem<D, ED> & {
    name: N;
    isEdited: boolean;
};
export type Domain = "executable" | "important";
export type EntityName = "unit" | "subworkflow";
export type ExternalContext = object;
declare abstract class ContextProvider<N extends string = string, D extends object = object, ED extends object = object, EC extends ExternalContext = ExternalContext> implements ContextProviderConfig<N, D, ED> {
    abstract name: N;
    abstract readonly domain: Domain;
    abstract readonly entityName: EntityName;
    protected abstract getDefaultData(): D;
    data?: D;
    readonly extraData?: ED;
    readonly externalContext: EC;
    isEdited: boolean;
    constructor(contextItem: ContextItem<D, ED>, externalContext: EC);
    setIsEdited(isEdited: boolean): void;
    getData(): D;
    setData(data?: D): void;
    getContextItem(): ExtendedContextItem<N, D, ED>;
}
export default ContextProvider;
