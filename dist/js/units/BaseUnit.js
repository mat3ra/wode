"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@mat3ra/code/dist/js/entity");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const HashedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const RuntimeItemsMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin");
const TaggableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/TaggableMixin");
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("../enums");
const BaseUnitSchemaMixin_1 = require("../generated/BaseUnitSchemaMixin");
const StatusSchemaMixin_1 = require("../generated/StatusSchemaMixin");
const baseUnits_1 = require("../utils/baseUnits");
const RuntimeItemsUILogicMixin_1 = require("./mixins/RuntimeItemsUILogicMixin");
class BaseUnit extends entity_1.InMemoryEntity {
    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config) {
        var _a;
        super({
            results: [],
            monitors: [],
            preProcessors: [],
            postProcessors: [],
            ...config,
            status: config.status || enums_1.UnitStatus.idle,
            statusTrack: config.statusTrack || [],
            flowchartId: (_a = config.flowchartId) !== null && _a !== void 0 ? _a : utils_1.Utils.uuid.getUUID(),
            tags: config.tags || [],
        });
        this.defaultResults = [];
        this.defaultMonitors = [];
        this.defaultPostProcessors = [];
        this.defaultPreProcessors = [];
        this.repetition = 0;
        this._initRuntimeItems(config);
    }
    get lastStatusUpdate() {
        const statusTrack = (this.statusTrack || []).filter((s) => {
            return (s.repetition || 0) === this.repetition;
        });
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
            flowchartId: utils_1.Utils.uuid.getUUID(),
            ...extraContext,
        };
        return super.clone(flowchartIDOverrideConfigAsExtraContext);
    }
    setRepetition(repetition) {
        this.repetition = repetition;
    }
    resetStatus() {
        this.setProps((0, baseUnits_1.resetStatus)(this._json));
    }
}
(0, TaggableMixin_1.taggableMixin)(BaseUnit.prototype);
(0, HashedEntityMixin_1.hashedEntityMixin)(BaseUnit.prototype);
(0, RuntimeItemsMixin_1.runtimeItemsMixin)(BaseUnit.prototype);
(0, RuntimeItemsUILogicMixin_1.runtimeItemsUILogicMixin)(BaseUnit.prototype);
(0, BaseUnitSchemaMixin_1.baseUnitSchemaMixin)(BaseUnit.prototype);
(0, StatusSchemaMixin_1.statusSchemaMixin)(BaseUnit.prototype);
(0, NamedEntityMixin_1.namedEntityMixin)(BaseUnit.prototype);
(0, DefaultableMixin_1.defaultableEntityMixin)(BaseUnit);
exports.default = BaseUnit;
