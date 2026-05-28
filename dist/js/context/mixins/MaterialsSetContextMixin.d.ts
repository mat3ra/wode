import type { OrderedMaterial } from "./MaterialContextMixin";
type MaterialsSet = {
    _id: string;
};
export type MaterialsSetContextMixin = {
    materialsSet: MaterialsSet;
    initMaterialsSetContextMixin(externalContext: MaterialsSetContextProvider): void;
    sortMaterialsByIndexInSet(materials?: OrderedMaterial[]): OrderedMaterial[];
};
type MaterialsSetContextProvider = {
    materialsSet: MaterialsSet;
};
export default function materialsSetContextMixin(item: MaterialsSetContextProvider): void;
export {};
