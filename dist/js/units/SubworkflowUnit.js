"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubworkflowUnit = void 0;
const enums_1 = require("../enums");
const SubworkflowUnitSchemaMixin_1 = require("../generated/SubworkflowUnitSchemaMixin");
const BaseUnit_1 = require("./BaseUnit");
class SubworkflowUnit extends BaseUnit_1.BaseUnit {
    constructor(config) {
        super({ name: "New Subworkflow", ...config, type: enums_1.UnitType.subworkflow });
    }
}
exports.SubworkflowUnit = SubworkflowUnit;
(0, SubworkflowUnitSchemaMixin_1.subworkflowUnitSchemaMixin)(SubworkflowUnit.prototype);
