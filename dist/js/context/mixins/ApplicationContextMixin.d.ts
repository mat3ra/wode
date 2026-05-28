import type { Application } from "@mat3ra/ade";
import type ContextProvider from "../providers/base/ContextProvider";
export type ApplicationContextMixin = {
    readonly application: Application;
    initApplicationContextMixin(externalContext: ApplicationExternalContext): void;
};
export type ApplicationExternalContext = {
    application?: Application;
};
export declare function applicationContextMixin(item: ContextProvider): void;
