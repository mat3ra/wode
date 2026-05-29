import type ContextProvider from "../providers/base/ContextProvider";
import type { OrderedMaterial } from "./MaterialContextMixin";
export type MaterialsSet = {
    _id: string;
};
export type MaterialsSetExternalContext = {
    materialsSet?: MaterialsSet;
};
export type MaterialsSetContextMixin = {
    materialsSet?: MaterialsSet;
    initMaterialsSetContextMixin(externalContext: MaterialsSetExternalContext): void;
    sortMaterialsByIndexInSet(materials?: OrderedMaterial[]): OrderedMaterial[];
};
export default function materialsSetContextMixin(item: ContextProvider): void;
