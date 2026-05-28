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

export default function jobContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & JobContextMixin = {
        isEdited: false,

        initJobContextMixin(externalContext: JobExternalContext) {
            this.job = externalContext.job;
            this.isEdited = false; // we always get the `defaultData` (recalculated from scratch, not persistent)
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
