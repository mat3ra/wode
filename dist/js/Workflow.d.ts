import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type DefaultableInMemoryEntityConstructor } from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import { type NamedInMemoryEntityConstructor } from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ApplicationSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import type { Material } from "@mat3ra/made";
import type { MetaPropertyHolder } from "@mat3ra/prode";
import type { MaterialExternalContext } from "./context/mixins/MaterialContextMixin";
import type { MaterialsExternalContext } from "./context/mixins/MaterialsContextMixin";
import type { MaterialsSetExternalContext } from "./context/mixins/MaterialsSetContextMixin";
import type { JobExternalContext } from "./context/providers/by_application/espresso/QEPWXInputDataManager";
import { UnitType } from "./enums";
import { type WorkflowSchemaMixin } from "./generated/WorkflowSchemaMixin";
import Subworkflow from "./Subworkflow";
import { MapUnit } from "./units";
import { type AnyWorkflowUnit } from "./units/factory";
type Base = typeof InMemoryEntity & DefaultableInMemoryEntityConstructor & NamedInMemoryEntityConstructor & Constructor<WorkflowSchemaMixin>;
/** Context passed to Workflow.render() before workflow reference is injected for subworkflows. */
export type WorkflowRenderContext = MaterialExternalContext & MaterialsExternalContext & MaterialsSetExternalContext & JobExternalContext;
declare const Workflow_base: Base;
export declare class Workflow extends Workflow_base implements WorkflowSchema {
    static readonly defaultConfig: WorkflowSchema;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    subworkflowInstances: Subworkflow[];
    private unitInstances;
    private workflowInstances;
    repetition: number;
    totalRepetitions: number;
    setTotalRepetitions(totalRepetition: number): void;
    setRepetition(repetition: number): void;
    static fromSubworkflow(subworkflow: Subworkflow): Workflow;
    constructor(config: WorkflowSchema & {
        applicationName?: string;
    });
    get workflows(): WorkflowSchema[];
    set workflows(value: WorkflowSchema[]);
    addSubworkflow(subworkflow: Subworkflow, head?: boolean, index?: number): void;
    updateMethodData(materials: Material[], metaProperties: MetaPropertyHolder[]): void;
    removeSubworkflow(id: string): void;
    setUnits(arr: AnyWorkflowUnit[]): void;
    render(context: WorkflowRenderContext): void;
    get usedApplications(): ApplicationSchema[];
    get usedApplicationNames(): string[];
    get usedApplicationVersions(): string[];
    get usedApplicationNamesWithVersions(): string[];
    getUsedModels(): ("dft" | "ml" | "unknown")[];
    getHumanReadableUsedModels(): string[];
    toJSON(): WorkflowSchema & AnyObject;
    getHumanReadableProperties(): string[];
    getProperties(): string[];
    getSystemName(): string;
    getDefaultDescription(): string;
    private addUnit;
    private removeUnit;
    addUnitType(type: UnitType, head?: boolean, index?: number): void;
    addMapUnit(mapUnit: MapUnit, mapWorkflow: Workflow): void;
    get allSubworkflows(): Subworkflow[];
    /**
     * @summary Calculates hash of the workflow. Meaningful fields are units and subworkflows.
     * units and subworkflows must be sorted topologically before hashing (already sorted).
     */
    calculateHash(): string;
    get hasRelaxation(): boolean;
    toggleRelaxation(): void;
    private getStandataRelaxationSubworkflow;
    private getRelaxationSubworkflow;
}
export {};
