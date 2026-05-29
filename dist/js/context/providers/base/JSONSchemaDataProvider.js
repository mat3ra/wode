"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContextProvider_1 = __importDefault(require("./ContextProvider"));
/**
 * @summary Provides jsonSchema only.
 */
class JSONSchemaDataProvider extends ContextProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.entityName = "unit";
        this.isUsingJinjaVariables = Boolean(externalContext === null || externalContext === void 0 ? void 0 : externalContext.isUsingJinjaVariables);
    }
}
exports.default = JSONSchemaDataProvider;
