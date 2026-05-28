import type { Application } from "@mat3ra/ade";

import type ContextProvider from "../providers/base/ContextProvider";
import { globalSettings } from "../providers/settings";

export type ApplicationContextMixin = {
    readonly application: Application;
    initApplicationContextMixin(externalContext: ApplicationExternalContext): void;
};

type PrivateProperties = {
    application?: Application;
};

export type ApplicationExternalContext = { application?: Application };

export function applicationContextMixin(item: ContextProvider) {
    // @ts-expect-error
    const properties: Provider & ApplicationContextMixin & PrivateProperties = {
        initApplicationContextMixin(externalContext: ApplicationExternalContext) {
            this.application =
                externalContext.application ?? globalSettings.Application.createDefault();
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
