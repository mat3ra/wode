"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOUnit = void 0;
const enums_1 = require("../enums");
const IOUnitSchemaMixin_1 = require("../generated/IOUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class IOUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({ name: enums_1.UnitType.io, subtype: "input", ...config, type: enums_1.UnitType.io });
    }
}
exports.IOUnit = IOUnit;
(0, IOUnitSchemaMixin_1.iOUnitSchemaMixin)(IOUnit.prototype);
