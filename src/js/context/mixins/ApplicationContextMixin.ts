import type { ApplicationSchema } from "@mat3ra/esse/dist/js/types";

import type ContextProvider from "../providers/base/ContextProvider";

export type ApplicationContextMixin = {
    application: ApplicationSchema;
    initApplicationContextMixin(externalContext: ApplicationExternalContext): void;
};

export type ApplicationExternalContext = { application: ApplicationSchema };

export default function applicationContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: ContextProvider & ApplicationContextMixin = {
        initApplicationContextMixin(externalContext: ApplicationExternalContext) {
            this.application = externalContext.application;
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
