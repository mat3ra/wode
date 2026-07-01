import { type NamedInMemoryEntity, InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type Defaultable } from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import { type HasDescription } from "@mat3ra/code/dist/js/entity/mixins/HasDescriptionMixin";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import { Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ApplicationSchema } from "@mat3ra/esse/dist/js/types";
import { ComputedEntityMixin } from "@mat3ra/ide/dist/js/compute";
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
import type { WorkflowSchema } from "./workflows/types";
interface Workflow extends Defaultable, NamedInMemoryEntity, WorkflowSchemaMixin, Taggable, HashedEntity, ComputedEntityMixin, HasDescription {
    compute: WorkflowSchema["compute"];
}
/** Context passed to Workflow.render() before `workflowHasRelaxation` is injected for subworkflows. */
export type WorkflowRenderContext = MaterialExternalContext & MaterialsExternalContext & MaterialsSetExternalContext & JobExternalContext;
declare class Workflow extends InMemoryEntity implements WorkflowSchema {
    createDefault: () => Workflow;
    static readonly defaultConfig: WorkflowSchema;
    _json: WorkflowSchema & AnyObject;
    static get jsonSchema(): import("json-schema").JSONSchema7 | undefined;
    subworkflowInstances: Subworkflow[];
    unitInstances: AnyWorkflowUnit[];
    workflowInstances: Workflow[];
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
    /**
     * A top-level subworkflow branch is represented twice: a {@link UnitType.subworkflow} unit in
     * `unitInstances` (flowchart card) and a full {@link Subworkflow} in `subworkflowInstances`
     * (linked by the same `id` as {@link Subworkflow.getAsUnit}). Their display names must match
     * so `toJSON()` and editors stay consistent. Call this after mutating a subworkflow unit's
     * `name` (and updating `unitInstances` via {@link setUnits}).
     */
    syncLinkedSubworkflowNameFromUnit(unit: AnyWorkflowUnit): void;
    render(context: WorkflowRenderContext): void;
    /**
     * Substitutes Jinja-templated context on execution units using `scope.global`.
     */
    renderContext(scopeGlobal: Record<string, unknown>, context: WorkflowRenderContext): void;
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
    removeUnit(flowchartId: string): void;
    addUnitType(type: UnitType, head?: boolean, index?: number): void;
    addMapUnit(mapUnit: MapUnit, mapWorkflow: Workflow): void;
    get allSubworkflows(): Subworkflow[];
    get hasRelaxation(): boolean;
    toggleRelaxation(): void;
    getHashObject(): {
        units: string;
        subworkflows: string;
        workflows: string;
    };
    private getStandataRelaxationSubworkflow;
    private getRelaxationSubworkflow;
}
export default Workflow;
