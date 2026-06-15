"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@mat3ra/code/dist/js/entity");
const in_memory_1 = require("@mat3ra/code/dist/js/entity/in_memory");
const DefaultableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/DefaultableMixin");
const HashedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin");
const NamedEntityMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin");
const RuntimeItemsMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin");
const TaggableMixin_1 = require("@mat3ra/code/dist/js/entity/mixins/TaggableMixin");
const utils_1 = require("@mat3ra/utils");
const enums_1 = require("../enums");
const BaseUnitSchemaMixin_1 = require("../generated/BaseUnitSchemaMixin");
const StatusSchemaMixin_1 = require("../generated/StatusSchemaMixin");
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
    static toErrorUnitSchema(unitData, error) {
        var _a, _b, _c, _d;
        let reasonPayload;
        if (error instanceof in_memory_1.EntityError && error.details) {
            reasonPayload = {
                error: error.details.error,
                json: unitData,
            };
        }
        else if (error instanceof Error) {
            reasonPayload = {
                error: { message: error.message, name: error.name },
                json: unitData,
            };
        }
        else {
            reasonPayload = {
                error,
                json: unitData,
            };
        }
        return {
            results: [],
            preProcessors: [],
            postProcessors: [],
            monitors: [],
            name: (_a = unitData.name) !== null && _a !== void 0 ? _a : enums_1.UnitType.error,
            type: enums_1.UnitType.error,
            status: enums_1.UnitStatus.error,
            flowchartId: (_b = unitData.flowchartId) !== null && _b !== void 0 ? _b : utils_1.Utils.uuid.getUUID(),
            reason: JSON.stringify(reasonPayload),
            next: (_c = unitData.next) !== null && _c !== void 0 ? _c : "",
            head: (_d = unitData.head) !== null && _d !== void 0 ? _d : false,
        };
    }
    static repairUnit(UnitClass, unitData) {
        try {
            return new UnitClass(unitData).toJSON();
        }
        catch (error) {
            return BaseUnit.toErrorUnitSchema(unitData, error);
        }
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
