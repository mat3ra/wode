import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import {
    type Defaultable,
    defaultableEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import {
    type HashedEntity,
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
import { type Taggable, taggableMixin } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type {
    BaseInMemoryEntitySchema,
    StatusSchema,
    WorkflowBaseUnitSchema,
} from "@mat3ra/esse/dist/js/types";
import { Utils } from "@mat3ra/utils";

import { UnitStatus } from "../enums";
import { type BaseUnitSchemaMixin, baseUnitSchemaMixin } from "../generated/BaseUnitSchemaMixin";
import {
    type StatusTrackSchemaMixin,
    statusTrackSchemaMixin,
} from "../generated/StatusTrackSchemaMixin";
import {
    type RuntimeItemsUILogic,
    runtimeItemsUILogicMixin,
} from "./mixins/RuntimeItemsUILogicMixin";

type Schema = WorkflowBaseUnitSchema;

export type UnitEntity<S extends Schema = Schema> = S & BaseInMemoryEntitySchema;

interface BaseUnitCore
    extends BaseUnitSchemaMixin,
        NamedEntity,
        StatusTrackSchemaMixin,
        Defaultable,
        Taggable,
        HashedEntity,
        RuntimeItems,
        RuntimeItemsUILogic {}

class BaseUnitCore extends InMemoryEntity<UnitEntity<Schema>> {
    defaultResults: NameResultSchema[] = [];

    defaultMonitors: NameResultSchema[] = [];

    defaultPostProcessors: NameResultSchema[] = [];

    defaultPreProcessors: NameResultSchema[] = [];

    repetition = 0;

    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config: Partial<Schema> & Pick<Schema, "name">) {
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
        const { type } = this._json as { type?: string };
        return { ...this.hashObjectFromRuntimeItems, ...(type !== undefined ? { type } : {}) };
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
}

taggableMixin(BaseUnitCore.prototype);
hashedEntityMixin(BaseUnitCore.prototype);
runtimeItemsMixin(BaseUnitCore.prototype);
runtimeItemsUILogicMixin(BaseUnitCore.prototype);
baseUnitSchemaMixin(BaseUnitCore.prototype);
statusTrackSchemaMixin(BaseUnitCore.prototype);
namedEntityMixin(BaseUnitCore.prototype);
defaultableEntityMixin(BaseUnitCore);

class BaseUnit<S extends Schema = Schema> extends BaseUnitCore {
    declare _json: UnitEntity<S>;

    declare toJSON: (exclude?: (keyof UnitEntity<S>)[]) => UnitEntity<S>;
}

export default BaseUnit;
