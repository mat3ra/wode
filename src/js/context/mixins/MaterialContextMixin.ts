import type { OrderedInMemoryEntityInSet } from "@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin";
import { Material } from "@mat3ra/made/dist/js/material";

import type ContextProvider from "../providers/base/ContextProvider";

export type OrderedMaterial = OrderedInMemoryEntityInSet & Material;

export type MaterialContextMixin = {
    readonly isMaterialCreatedDefault: boolean;
    readonly isMaterialUpdated: boolean;
    material: OrderedMaterial;
    extraData?: { materialHash: string };
    initMaterialContextMixin(externalContext: MaterialExternalContext): void;
    updateMaterialHash(): void;
};

export type MaterialExternalContext = {
    material: OrderedMaterial;
};

export default function materialContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & MaterialContextMixin = {
        updateMaterialHash() {
            this.extraData = { materialHash: this.material.hash };
        },

        initMaterialContextMixin(externalContext: MaterialExternalContext) {
            this.material = externalContext.material;
            this.updateMaterialHash();
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
