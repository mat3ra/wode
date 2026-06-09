import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { EntityError } from "@mat3ra/code/dist/js/entity/in_memory";
import {
    type Defaultable,
    defaultableEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import {
    HashedEntity,
    hashedEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import {
    type NamedEntity,
    namedEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import {
    type RuntimeItems,
    runtimeItemsMixin,
} from "@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin";
import { Taggable, taggableMixin } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ErrorUnitSchema,
    StatusSchema,
    WorkflowBaseUnitSchema,
} from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import { UnitStatus, UnitType } from "../enums";
import { type BaseUnitSchemaMixin, baseUnitSchemaMixin } from "../generated/BaseUnitSchemaMixin";
import { type StatusSchemaMixin, statusSchemaMixin } from "../generated/StatusSchemaMixin";
import {
    type RuntimeItemsUILogic,
    runtimeItemsUILogicMixin,
} from "./mixins/RuntimeItemsUILogicMixin";

type Schema = WorkflowBaseUnitSchema;

type RepairableUnitConstructor<US extends Schema, C = Partial<US>> = new (config: C) => {
    toJSON(): US;
};

type Base = typeof InMemoryEntity &
    Constructor<NamedEntity> &
    Constructor<Defaultable> &
    Constructor<Taggable> &
    Constructor<HashedEntity> &
    Constructor<RuntimeItems> &
    Constructor<RuntimeItemsUILogic> &
    Constructor<BaseUnitSchemaMixin> &
    Constructor<StatusSchemaMixin>;

class BaseUnit<S extends Schema = Schema> extends (InMemoryEntity as Base) implements Schema {
    declare toJSON: () => Schema & AnyObject;

    declare _json: Schema & AnyObject;

    defaultResults: NameResultSchema[] = [];

    defaultMonitors: NameResultSchema[] = [];

    defaultPostProcessors: NameResultSchema[] = [];

    defaultPreProcessors: NameResultSchema[] = [];

    repetition = 0;

    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config: Partial<S> & Pick<S, "name">) {
        super({
            results: [],
            monitors: [],
            preProcessors: [],
            postProcessors: [],
            ...config,
            status: config.status || UnitStatus.idle,
            statusTrack: config.statusTrack || [],
            flowchartId: config.flowchartId ?? Utils.uuid.getUUID(),
            tags: config.tags || [],
        });

        this._initRuntimeItems(config);
    }

    get lastStatusUpdate() {
        const statusTrack = (this.statusTrack || []).filter((s) => {
            return (s.repetition || 0) === this.repetition;
        });
        const sortedStatusTrack = statusTrack.sort((a, b) => a.trackedAt - b.trackedAt); // lodash.sortBy(statusTrack, (x) => x.trackedAt);
        return sortedStatusTrack[sortedStatusTrack.length - 1];
    }

    getHashObject(): object {
        return { ...this.hashObjectFromRuntimeItems, type: this.type };
    }

    isInStatus(status: StatusSchema["status"]) {
        return this.status === status;
    }

    clone(extraContext: object) {
        const flowchartIDOverrideConfigAsExtraContext = {
            flowchartId: Utils.uuid.getUUID(),
            ...extraContext,
        };
        return super.clone(flowchartIDOverrideConfigAsExtraContext);
    }

    setRepetition(repetition: number) {
        this.repetition = repetition;
    }

    static toErrorUnitSchema(unitData: Partial<Schema>, error: unknown): ErrorUnitSchema {
        const detailsError = error instanceof EntityError ? error.details?.error : undefined;
        const reasonPayload =
            detailsError ??
            (error instanceof Error ? { message: error.message, name: error.name } : error);

        return {
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            name: unitData.name ?? UnitType.error,
            type: UnitType.error,
            status: UnitStatus.error,
            flowchartId: unitData.flowchartId ?? Utils.uuid.getUUID(),
            reason: JSON.stringify(reasonPayload),
            next: unitData.next ?? "",
            head: unitData.head ?? false,
            originalUnit: unitData,
        };
    }

    static repairUnit<US extends Schema, C = Partial<US>>(
        UnitClass: RepairableUnitConstructor<US, C>,
        unitData: C,
    ): US | ErrorUnitSchema {
        try {
            return new UnitClass(unitData).toJSON();
        } catch (error: unknown) {
            return BaseUnit.toErrorUnitSchema(unitData as Partial<Schema>, error);
        }
    }
}

taggableMixin(BaseUnit.prototype);
hashedEntityMixin(BaseUnit.prototype);
runtimeItemsMixin(BaseUnit.prototype);
runtimeItemsUILogicMixin(BaseUnit.prototype);
baseUnitSchemaMixin(BaseUnit.prototype);
statusSchemaMixin(BaseUnit.prototype);
namedEntityMixin(BaseUnit.prototype);
defaultableEntityMixin(BaseUnit);

export default BaseUnit;
