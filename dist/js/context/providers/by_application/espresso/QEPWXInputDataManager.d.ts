import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { InputContextItemSchema, QEPwxContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type JobContextMixin, type JobExternalContext } from "../../../mixins/JobContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MethodDataContextMixin, type MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import { type WorkflowContextMixin, type WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { UnitContext } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Data = QEPwxContextProviderSchema;
type Schema = InputContextItemSchema & {
    data: Data;
};
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & MaterialExternalContext & JobExternalContext & MethodDataExternalContext & MaterialsExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> & Constructor<JobContextMixin> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin> & Constructor<MethodDataContextMixin> & Constructor<WorkflowContextMixin>;
declare const QEPWXInputDataManager_base: Base;
export default class QEPWXInputDataManager extends QEPWXInputDataManager_base {
    readonly name: "input";
    readonly domain: "executable";
    readonly entityName: "unit";
    isEdited: boolean;
    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext): QEPWXInputDataManager;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: Partial<Schema>, externalContext: ExternalContext);
    private buildQEPWXContext;
    getDefaultData(): {
        perMaterial: QEPwxContextProviderSchema[];
        IBRAV: number;
        RESTART_MODE: "from_scratch" | "restart";
        ATOMIC_SPECIES: {
            X: string;
            Mass_X: number;
            PseudoPot_X: string;
        }[];
        ATOMIC_SPECIES_WITH_LABELS: {
            X: string;
            Mass_X: number;
            PseudoPot_X: string;
        }[];
        NAT: number;
        NTYP: number;
        NTYP_WITH_LABELS: number;
        ATOMIC_POSITIONS: {
            X?: string;
            x: number;
            y: number;
            z: number;
            "if_pos(1)"?: number;
            "if_pos(2)"?: number;
            "if_pos(3)"?: number;
        }[];
        ATOMIC_POSITIONS_WITHOUT_CONSTRAINTS: string;
        CELL_PARAMETERS: {
            v1?: [number, number, number];
            v2?: [number, number, number];
            v3?: [number, number, number];
        };
        contextProviderName: "qe-pwx";
    };
}
export {};
