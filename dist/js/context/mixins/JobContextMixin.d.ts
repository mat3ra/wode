import type { JobSchema } from "@mat3ra/esse/dist/js/types";
import type ContextProvider from "../providers/base/ContextProvider";
export type JobContextMixin = {
    isEdited: boolean;
    job?: Pick<JobSchema, "parent">;
    initJobContextMixin(externalContext: JobExternalContext): void;
};
export type JobExternalContext = {
    job?: Pick<JobSchema, "parent">;
};
export default function jobContextMixin(item: ContextProvider): void;
