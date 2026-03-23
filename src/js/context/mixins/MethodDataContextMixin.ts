import type { BaseMethod } from "@mat3ra/esse/dist/js/types";
import type { AtomicElementValue } from "@mat3ra/made/dist/js/basis/elements";

import type ContextProvider from "../providers/base/ContextProvider";

// TODO: create a task to define correct type for MethodData
type MethodData = BaseMethod["data"] & {
    pseudo?: { element: AtomicElementValue; filename?: string; path?: string }[];
};

export type MethodDataContextMixin = {
    methodData: MethodData;
    initMethodDataContextMixin(externalContext: MethodDataExternalContext): void;
};

export type MethodDataExternalContext = {
    methodData?: MethodData;
};

export default function methodDataContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & MethodDataContextMixin = {
        methodData: {},

        initMethodDataContextMixin(externalContext: MethodDataExternalContext) {
            this.methodData = externalContext.methodData || {};
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
