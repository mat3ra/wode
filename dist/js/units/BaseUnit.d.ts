import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type Defaultable } from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import { HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import { HasRepetition } from "@mat3ra/code/dist/js/entity/mixins/HasRepetitionMixin";
import { type NamedEntity } from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import { type RuntimeItems } from "@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin";
import { Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { StatusSchema, WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type BaseUnitSchemaMixin } from "../generated/BaseUnitSchemaMixin";
import { type StatusSchemaMixin } from "../generated/StatusSchemaMixin";
import { type RuntimeItemsUILogic } from "../RuntimeItemsUILogicMixin";
type Base = typeof InMemoryEntity & Constructor<NamedEntity> & Constructor<Defaultable> & Constructor<HasRepetition> & Constructor<Taggable> & Constructor<HashedEntity> & Constructor<RuntimeItems> & Constructor<RuntimeItemsUILogic> & Constructor<BaseUnitSchemaMixin> & Constructor<StatusSchemaMixin>;
type Schema = WorkflowBaseUnitSchema;
declare const BaseUnit_base: Base;
export declare class BaseUnit<S extends Schema = Schema> extends BaseUnit_base implements Schema {
    static usePredefinedIds: boolean;
    static generateFlowChartId(name: string): any;
    defaultResults: NameResultSchema[];
    defaultMonitors: NameResultSchema[];
    defaultPostProcessors: NameResultSchema[];
    defaultPreProcessors: NameResultSchema[];
    allowedResults: NameResultSchema[];
    allowedMonitors: NameResultSchema[];
    allowedPostProcessors: NameResultSchema[];
    constructor(config: Partial<S> & Pick<S, "name">);
    get lastStatusUpdate(): {
        trackedAt: number;
        status: string;
        repetition?: number;
    };
    getHashObject(): object;
    isInStatus(status: StatusSchema["status"]): boolean;
    clone(extraContext: object): this;
}
export {};
