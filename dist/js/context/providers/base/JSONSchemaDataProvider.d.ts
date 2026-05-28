import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { ContextItemSchema } from "@mat3ra/esse/dist/js/types";
import ContextProvider from "./ContextProvider";
export interface JinjaExternalContext {
    isUsingJinjaVariables?: boolean;
}
/**
 * @summary Provides jsonSchema only.
 */
declare abstract class JSONSchemaDataProvider<S extends ContextItemSchema = ContextItemSchema, EC extends JinjaExternalContext = JinjaExternalContext, DataForRendering = S["data"]> extends ContextProvider<S, EC, DataForRendering> {
    abstract readonly jsonSchema: JSONSchema;
    readonly entityName: "unit";
    isUsingJinjaVariables: boolean;
    constructor(contextItem: Partial<S>, externalContext: EC);
}
export default JSONSchemaDataProvider;
