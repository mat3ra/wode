import type { OrderedInMemoryEntityInSet } from "@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin";
import type { MaterialHashed } from "@mat3ra/made";
import type ContextProvider from "../providers/base/ContextProvider";
export type OrderedMaterial = OrderedInMemoryEntityInSet & MaterialHashed;
export type MaterialContextMixin = {
    readonly isMaterialCreatedDefault: boolean;
    readonly isMaterialUpdated: boolean;
    material: OrderedMaterial;
    initMaterialContextMixin(externalContext: MaterialExternalContext): void;
    updateMaterialHash(): void;
};
export type MaterialExternalContext = {
    material: OrderedMaterial;
};
export default function materialContextMixin(item: ContextProvider): void;
