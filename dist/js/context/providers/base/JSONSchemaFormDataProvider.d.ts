import type { ContextItemSchema } from "@mat3ra/esse/dist/js/types";
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
declare abstract class JSONSchemaFormDataProvider<S extends ContextItemSchema = ContextItemSchema, EC extends JinjaExternalContext = JinjaExternalContext, DataForRendering = S["data"]> extends JSONSchemaDataProvider<S, EC, DataForRendering> {
    fields: object;
    protected abstract uiSchema: UiSchema;
    get uiSchemaStyled(): UiSchema;
}
export default JSONSchemaFormDataProvider;
