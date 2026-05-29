import type ContextProvider from "../providers/base/ContextProvider";
import type { OrderedMaterial } from "./MaterialContextMixin";

export type MaterialsContextMixin = {
    materials: OrderedMaterial[];
    initMaterialsContextMixin(externalContext: MaterialsExternalContext): void;
};

export type MaterialsExternalContext = {
    materials: OrderedMaterial[];
};

export default function materialsContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & MaterialsContextMixin = {
        materials: [],

        initMaterialsContextMixin(externalContext: MaterialsExternalContext) {
            this.materials = externalContext.materials;
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
