import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type Defaultable } from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import { HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import { type NamedEntity } from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import { type RuntimeItems } from "@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin";
import { Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { ErrorUnitSchema, StatusSchema, WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type BaseUnitSchemaMixin } from "../generated/BaseUnitSchemaMixin";
import { type StatusSchemaMixin } from "../generated/StatusSchemaMixin";
import { type RuntimeItemsUILogic } from "./mixins/RuntimeItemsUILogicMixin";
type Schema = WorkflowBaseUnitSchema;
type RepairableUnitConstructor<US extends Schema, C = Partial<US>> = new (config: C) => {
    toJSON(): US;
};
type Base = typeof InMemoryEntity & Constructor<NamedEntity> & Constructor<Defaultable> & Constructor<Taggable> & Constructor<HashedEntity> & Constructor<RuntimeItems> & Constructor<RuntimeItemsUILogic> & Constructor<BaseUnitSchemaMixin> & Constructor<StatusSchemaMixin>;
declare const BaseUnit_base: Base;
declare class BaseUnit<S extends Schema = Schema> extends BaseUnit_base implements Schema {
    toJSON: () => Schema & AnyObject;
    _json: Schema & AnyObject;
    defaultResults: NameResultSchema[];
    defaultMonitors: NameResultSchema[];
    defaultPostProcessors: NameResultSchema[];
    defaultPreProcessors: NameResultSchema[];
    repetition: number;
    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config: Partial<S> & Pick<S, "name">);
    get lastStatusUpdate(): {
        trackedAt: number;
        status: string;
        repetition?: number;
    };
    getHashObject(): object;
    isInStatus(status: StatusSchema["status"]): boolean;
    clone(extraContext: object): this;
    setRepetition(repetition: number): void;
    static toErrorUnitSchema(unitData: Partial<Schema>, error: unknown): ErrorUnitSchema;
    static repairUnit<US extends Schema, C = Partial<US>>(UnitClass: RepairableUnitConstructor<US, C>, unitData: C): US | ErrorUnitSchema;
}
export default BaseUnit;
