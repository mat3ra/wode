/* eslint-disable class-methods-use-this */
import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";

import type { ContextItem, EntityName, ExternalContext } from "./ContextProvider";
import ContextProvider from "./ContextProvider";

export interface JinjaExternalContext extends ExternalContext {
    isUsingJinjaVariables?: boolean;
}

/**
 * @summary Provides jsonSchema only.
 */
abstract class JSONSchemaDataProvider<
    N extends string = string,
    D extends object = object,
    ED extends object = object,
    EC extends JinjaExternalContext = JinjaExternalContext,
    // eslint-disable-next-line prettier/prettier
> extends ContextProvider<N, D, ED, EC> {
    abstract readonly jsonSchema: JSONSchema | undefined;

    readonly entityName: EntityName = "unit";

    isUsingJinjaVariables: boolean;

    constructor(contextItem: ContextItem<D, ED>, externalContext: EC) {
        super(contextItem, externalContext);
        this.isUsingJinjaVariables = Boolean(externalContext?.isUsingJinjaVariables);
    }
}

export default JSONSchemaDataProvider;
