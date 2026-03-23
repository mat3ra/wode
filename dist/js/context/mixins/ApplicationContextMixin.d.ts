import type { ApplicationSchema } from "@mat3ra/esse/dist/js/types";
import type ContextProvider from "../providers/base/ContextProvider";
export type ApplicationContextMixin = {
    application: ApplicationSchema;
    initApplicationContextMixin(externalContext: ApplicationExternalContext): void;
};
export type ApplicationExternalContext = {
    application: ApplicationSchema;
};
export default function applicationContextMixin(item: ContextProvider): void;
