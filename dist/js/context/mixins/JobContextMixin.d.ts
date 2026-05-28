import type { JobSchema } from "@mat3ra/esse/dist/js/types";
import type ContextProvider from "../providers/base/ContextProvider";
export type JobContextMixin = {
    isEdited: boolean;
    job: JobSchema;
    initJobContextMixin(externalContext: JobExternalContext): void;
};
export type JobExternalContext = {
    job: JobSchema;
};
export default function jobContextMixin(item: ContextProvider): void;
