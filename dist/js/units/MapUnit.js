"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMapConfig = void 0;
const enums_1 = require("../enums");
const MapUnitSchemaMixin_1 = require("../generated/MapUnitSchemaMixin");
const BaseUnit_1 = __importDefault(require("./BaseUnit"));
exports.defaultMapConfig = {
    name: enums_1.UnitType.map,
    type: enums_1.UnitType.map,
    workflowId: "",
    input: {
        target: "MAP_DATA",
        scope: "global",
        name: "",
        values: [],
        useValues: false,
    },
    results: [],
    monitors: [],
    preProcessors: [],
    postProcessors: [],
};
class MapUnit extends BaseUnit_1.default {
    constructor(config) {
        var _a;
        const schema = {
            ...exports.defaultMapConfig,
            ...config,
            flowchartId: (_a = config.flowchartId) !== null && _a !== void 0 ? _a : "",
            type: enums_1.UnitType.map,
        };
        super(schema);
    }
    setWorkflowId(id) {
        this.setProp("workflowId", id);
    }
}
(0, MapUnitSchemaMixin_1.mapUnitSchemaMixin)(MapUnit.prototype);
exports.default = MapUnit;
