/*
 * @summary This is a standalone class that contains "data" for a property with "name". Helps facilitate UI logic.
 *          Can be initialized from context when user edits are present:
 *          - user edits the corresponding property, eg. "kpath"
 *          - isKpathEdited is set to `true`
 *          - context property is updated for the parent entity (eg. Unit) in a way that persists in Redux state
 *          - new entity inherits the "data" through "context" field in config
 *          - `extraData` field is used to store any other data that should be passed from one instance of provider
 *             to next one, for example data about material to track when it is changed.
 * @notes   Should hold static data only (see `setData` method), no classes or functions
 */
import { ContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

export interface ContextProviderInstance {
    constructor: typeof ContextProvider;
    config: ContextProviderSchema;
}

export type ContextProviderConfig<
    N extends string = string,
    D extends object = object,
    ED extends object = object,
> = {
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

export type ExtendedContextItem<
    N extends string = string,
    D extends object = object,
    ED extends object = object,
> = ContextItem<D, ED> & {
    name: N;
    isEdited: boolean;
};

export type Domain = "executable" | "important";

export type EntityName = "unit" | "subworkflow";

export type ExternalContext = object;

abstract class ContextProvider<
    N extends string = string,
    D extends object = object,
    ED extends object = object,
    EC extends ExternalContext = ExternalContext,
    // eslint-disable-next-line prettier/prettier
> implements ContextProviderConfig<N, D, ED> {
    abstract name: N;

    abstract readonly domain: Domain;

    abstract readonly entityName: EntityName;

    protected abstract getDefaultData(): D;

    data?: D;

    readonly extraData?: ED;

    readonly externalContext: EC;

    isEdited: boolean;

    constructor(contextItem: ContextItem<D, ED>, externalContext: EC) {
        this.externalContext = externalContext;
        this.extraData = contextItem.extraData;
        this.isEdited = contextItem.isEdited || false;

        this.setData(contextItem.data);
    }

    setIsEdited(isEdited: boolean) {
        this.isEdited = isEdited;
    }

    getData() {
        return this.isEdited && this.data ? this.data : this.getDefaultData();
    }

    setData(data?: D) {
        this.data = data ? Utils.clone.deepClone(data) : undefined;
    }

    getContextItem(): ExtendedContextItem<N, D, ED> {
        return {
            name: this.name,
            isEdited: this.isEdited,
            data: this.getData(),
            extraData: this.extraData,
        };
    }
}

export default ContextProvider;
