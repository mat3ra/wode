import type { CutoffsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type ApplicationContextMixin, type ApplicationExternalContext } from "../mixins/ApplicationContextMixin";
import ContextProvider, { type BaseExternalContext, type UnitContext } from "./base/ContextProvider";
type Schema = CutoffsContextItemSchema;
type PlanewaveExternalContext = BaseExternalContext & ApplicationExternalContext;
interface PlanewaveCutoffDataManager extends ApplicationContextMixin {
}
declare class PlanewaveCutoffDataManager extends ContextProvider<Schema, PlanewaveExternalContext> {
    readonly name: "cutoffs";
    readonly domain: "important";
    readonly entityName: "subworkflow";
    readonly jsonSchema: JSONSchema7;
    readonly uiSchema: {
        readonly wavefunction: {};
        readonly density: {};
    };
    readonly extraData: {};
    static createFromUnitContext(unitContext: UnitContext, externalContext: PlanewaveExternalContext): PlanewaveCutoffDataManager;
    constructor(contextItem: Partial<Schema>, externalContext: PlanewaveExternalContext);
    getDefaultData(): {
        wavefunction: number | undefined;
        density: number | undefined;
    };
}
export default PlanewaveCutoffDataManager;
