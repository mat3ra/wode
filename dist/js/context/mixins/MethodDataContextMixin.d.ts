import type { BaseMethod } from "@mat3ra/esse/dist/js/types";
import type { AtomicElementValue } from "@mat3ra/made/dist/js/basis/elements";
import type ContextProvider from "../providers/base/ContextProvider";
type MethodData = BaseMethod["data"] & {
    pseudo?: {
        element: AtomicElementValue;
        filename?: string;
        path?: string;
    }[];
};
export type MethodDataContextMixin = {
    methodData: MethodData;
    isEdited: boolean;
    initMethodDataContextMixin(externalContext: MethodDataExternalContext): void;
};
export type MethodDataExternalContext = {
    methodData?: MethodData;
    isEdited?: boolean;
};
export default function methodDataContextMixin(item: ContextProvider): void;
export {};
