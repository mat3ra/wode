/* eslint-disable class-methods-use-this */
// import { JSONSchemaDataProvider } from "@mat3ra/ade";
import type { UiSchema } from "react-jsonschema-form";

import JSONSchemaDataProvider, { type JinjaExternalContext } from "./JSONSchemaDataProvider";

/**
 * @summary Provides jsonSchema and uiSchema for generating react-jsonschema-form
 *          See https://github.com/mozilla-services/react-jsonschema-form for Form UI.
 *          Form generation example:
 * ```
 * <Form schema={provider.jsonSchema}
 *      uiSchema={provider.uiSchema}
 *      formData={provider.getData(unit.important)} />
 * ```
 */
abstract class JSONSchemaFormDataProvider<
    N extends string = string,
    D extends object = object,
    ED extends object = object,
    EC extends JinjaExternalContext = JinjaExternalContext,
> extends JSONSchemaDataProvider<N, D, ED, EC> {
    fields: object = {};

    protected abstract uiSchema: UiSchema;

    get uiSchemaStyled(): UiSchema {
        return Object.fromEntries(
            Object.entries(this.uiSchema).map(([key, value]) => [
                key,
                {
                    ...value,
                    classNames: `${value.classNames || ""}`,
                },
            ]),
        );
    }
}

export default JSONSchemaFormDataProvider;
