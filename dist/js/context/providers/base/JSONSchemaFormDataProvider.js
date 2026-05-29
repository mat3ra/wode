"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchemaDataProvider_1 = __importDefault(require("./JSONSchemaDataProvider"));
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
class JSONSchemaFormDataProvider extends JSONSchemaDataProvider_1.default {
    constructor() {
        super(...arguments);
        this.fields = {};
    }
    get uiSchemaStyled() {
        return Object.fromEntries(Object.entries(this.uiSchema).map(([key, value]) => [
            key,
            {
                ...value,
                classNames: `${value.classNames || ""}`,
            },
        ]));
    }
}
exports.default = JSONSchemaFormDataProvider;
