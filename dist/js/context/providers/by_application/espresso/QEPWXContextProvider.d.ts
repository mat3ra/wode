import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { QEPwxContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";
import { type JobContextMixin, type JobExternalContext } from "../../../mixins/JobContextMixin";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../../mixins/MaterialContextMixin";
import { type MaterialsContextMixin, type MaterialsExternalContext } from "../../../mixins/MaterialsContextMixin";
import { type MethodDataContextMixin, type MethodDataExternalContext } from "../../../mixins/MethodDataContextMixin";
import { type WorkflowContextMixin, type WorkflowExternalContext } from "../../../mixins/WorkflowContextMixin";
import type { ContextItem, Domain } from "../../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../../base/JSONSchemaDataProvider";
type Name = "input";
type Data = QEPwxContextProviderSchema;
type ExternalContext = JinjaExternalContext & WorkflowExternalContext & MaterialExternalContext & JobExternalContext & MethodDataExternalContext & MaterialsExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> & Constructor<JobContextMixin> & Constructor<MaterialContextMixin> & Constructor<MaterialsContextMixin> & Constructor<MethodDataContextMixin> & Constructor<WorkflowContextMixin>;
declare const QEPWXContextProvider_base: Base;
export default class QEPWXContextProvider extends QEPWXContextProvider_base {
    readonly name: Name;
    readonly domain: Domain;
    readonly jsonSchema: JSONSchema7 | undefined;
    constructor(config: ContextItem<Data>, externalContext: ExternalContext);
    private buildQEPWXContext;
    private getDataPerMaterial;
    getDefaultData(): {
        perMaterial?: undefined;
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
    } | {
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
