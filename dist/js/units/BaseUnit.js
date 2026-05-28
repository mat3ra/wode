"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUnit = void 0;
/* eslint-disable class-methods-use-this */
const entity_1 = require("@mat3ra/code/dist/js/entity");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const HashedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin");
const HasRepetitionMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HasRepetitionMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const RuntimeItemsMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin");
const TaggableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/TaggableMixin");
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("../enums");
const BaseUnitSchemaMixin_1 = require("../generated/BaseUnitSchemaMixin");
const StatusSchemaMixin_1 = require("../generated/StatusSchemaMixin");
const RuntimeItemsUILogicMixin_1 = require("../RuntimeItemsUILogicMixin");
// eslint-disable-next-line prettier/prettier
class BaseUnit extends entity_1.InMemoryEntity {
    static generateFlowChartId(name) {
        if (this.usePredefinedIds) {
            return utils_1.Utils.uuid.getUUIDFromNamespace(`flowchart-${name}`);
        }
        return utils_1.Utils.uuid.getUUID();
    }
    constructor(config) {
        super({
            results: [],
            monitors: [],
            preProcessors: [],
            postProcessors: [],
            ...config,
            status: config.status || enums_1.UNIT_STATUSES.idle,
            statusTrack: config.statusTrack || [],
            flowchartId: config.flowchartId || BaseUnit.generateFlowChartId(config.name),
            tags: config.tags || [],
        });
        this.defaultResults = [];
        this.defaultMonitors = [];
        this.defaultPostProcessors = [];
        this.defaultPreProcessors = [];
        this.allowedResults = [];
        this.allowedMonitors = [];
        this.allowedPostProcessors = [];
        this._initRuntimeItems(config);
    }
    get lastStatusUpdate() {
        const statusTrack = (this.statusTrack || []).filter((s) => (s.repetition || 0) === this.repetition);
        const sortedStatusTrack = statusTrack.sort((a, b) => a.trackedAt - b.trackedAt); // lodash.sortBy(statusTrack, (x) => x.trackedAt);
        return sortedStatusTrack[sortedStatusTrack.length - 1];
    }
    getHashObject() {
        return { ...this.hashObjectFromRuntimeItems, type: this.type };
    }
    isInStatus(status) {
        return this.status === status;
    }
    clone(extraContext) {
        const flowchartIDOverrideConfigAsExtraContext = {
            flowchartId: BaseUnit.generateFlowChartId(this.name),
            ...extraContext,
        };
        return super.clone(flowchartIDOverrideConfigAsExtraContext);
    }
}
exports.BaseUnit = BaseUnit;
BaseUnit.usePredefinedIds = false;
(0, TaggableMixin_1.taggableMixin)(BaseUnit.prototype);
(0, HashedEntityMixin_1.hashedEntityMixin)(BaseUnit.prototype);
(0, HasRepetitionMixin_1.hasRepetitionMixin)(BaseUnit.prototype);
(0, RuntimeItemsMixin_1.runtimeItemsMixin)(BaseUnit.prototype);
(0, RuntimeItemsUILogicMixin_1.runtimeItemsUILogicMixin)(BaseUnit.prototype);
(0, BaseUnitSchemaMixin_1.baseUnitSchemaMixin)(BaseUnit.prototype);
(0, StatusSchemaMixin_1.statusSchemaMixin)(BaseUnit.prototype);
(0, NamedEntityMixin_1.namedEntityMixin)(BaseUnit.prototype);
(0, DefaultableMixin_1.defaultableEntityMixin)(BaseUnit);
