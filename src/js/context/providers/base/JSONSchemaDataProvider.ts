import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type { ContextItemSchema } from "@mat3ra/esse/dist/js/types";

import ContextProvider from "./ContextProvider";

export interface JinjaExternalContext {
    isUsingJinjaVariables?: boolean;
}

/**
 * @summary Provides jsonSchema only.
 */
abstract class JSONSchemaDataProvider<
    S extends ContextItemSchema = ContextItemSchema,
    EC extends JinjaExternalContext = JinjaExternalContext,
    // eslint-disable-next-line prettier/prettier
> extends ContextProvider<S, EC> {
    abstract readonly jsonSchema: JSONSchema;

    readonly entityName = "unit" as const;

    isUsingJinjaVariables: boolean;

    constructor(contextItem: Partial<S>, externalContext: EC) {
        super(contextItem, externalContext);
        this.isUsingJinjaVariables = Boolean(externalContext?.isUsingJinjaVariables);
    }
}

export default JSONSchemaDataProvider;
