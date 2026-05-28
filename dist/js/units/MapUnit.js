"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapUnit = exports.defaultMapConfig = void 0;
const enums_1 = require("../enums");
const MapUnitSchemaMixin_1 = require("../generated/MapUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
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
};
class MapUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({ ...exports.defaultMapConfig, ...config });
    }
    setWorkflowId(id) {
        this.setProp("workflowId", id);
    }
}
exports.MapUnit = MapUnit;
(0, MapUnitSchemaMixin_1.mapUnitSchemaMixin)(MapUnit.prototype);
