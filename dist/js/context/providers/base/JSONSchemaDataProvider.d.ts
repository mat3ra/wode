import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { ContextItem, EntityName, ExternalContext } from "./ContextProvider";
import ContextProvider from "./ContextProvider";
export interface JinjaExternalContext extends ExternalContext {
    isUsingJinjaVariables?: boolean;
}
/**
 * @summary Provides jsonSchema only.
 */
declare abstract class JSONSchemaDataProvider<N extends string = string, D extends object = object, ED extends object = object, EC extends JinjaExternalContext = JinjaExternalContext> extends ContextProvider<N, D, ED, EC> {
    abstract readonly jsonSchema: JSONSchema | undefined;
    readonly entityName: EntityName;
    isUsingJinjaVariables: boolean;
    constructor(contextItem: ContextItem<D, ED>, externalContext: EC);
}
export default JSONSchemaDataProvider;
