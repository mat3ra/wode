import type { MlTrainTestSplitContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";
type Schema = MlTrainTestSplitContextItemSchema;
type ExternalContext = JinjaExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext>;
declare const MLTrainTestSplitDataManager_base: Base;
export default class MLTrainTestSplitDataManager extends MLTrainTestSplitDataManager_base {
    readonly name: "mlTrainTestSplit";
    readonly domain: "important";
    readonly entityName: "unit";
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): MLTrainTestSplitDataManager;
    readonly jsonSchema: JSONSchema7;
    readonly uiSchema: {
        readonly target_column_name: {};
        readonly problem_category: {};
    };
    readonly extraData: {};
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext);
    getDefaultData(): {
        fraction_held_as_test_set: number;
    };
}
export {};
