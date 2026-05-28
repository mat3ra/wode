"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnitsHead = setUnitsHead;
exports.setNextLinks = setNextLinks;
exports.applyConfig = applyConfig;
exports.findUnit = findUnit;
const lodash_1 = __importDefault(require("lodash"));
/**
 * @summary set the head of an array of units
 * @param units
 * @returns {Unit[]}
 */
function setUnitsHead(units) {
    if (units.length > 0) {
        units[0].head = true;
        lodash_1.default.tail(units).map((x) => (x.head = false));
    }
    return units;
}
// TODO: fix setNextLinks on unit removal and convergence logic.
/**
 * @summary Re-establishes the linked `next => flowchartId` logic in an array of units
 * @params units {Unit[]}
 * @returns units {Unit[]}
 */
function setNextLinks(units) {
    const flowchartIds = units.map((u) => u.flowchartId);
    for (let i = 0; i < units.length - 1; i++) {
        if (!units[i].next) {
            // newly added units don't have next set yet => set it
            units[i].next = units[i + 1].flowchartId;
            if (i > 0)
                units[i - 1].next = units[i].flowchartId;
        }
        else if (!flowchartIds.includes(units[i].next)) {
            // newly removed units may create broken next links => fix it
            units[i].next = units[i + 1].flowchartId;
        }
    }
    return units;
}
/**
 * @summary Apply configuration data to an object
 * @param obj {*} object / class containing methods or attributes to be set
 * @param config { functions: {}, attributes: {} } functions to call and attributes to set
 * @param callBuild {boolean} if true; call build between applying functions and attributes
 * @returns {*} updated object
 */
function applyConfig({ obj, config = {}, callBuild = false }) {
    const { functions = {}, attributes = {} } = config;
    // eslint-disable-next-line no-restricted-syntax
    for (const [func, args] of Object.entries(functions)) {
        // eslint-disable-next-line no-nested-ternary
        if (obj[func]) {
            if (args)
                obj[func](args);
            else
                obj[func]();
        }
    }
    const modified = callBuild ? obj.build() : obj;
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, values] of Object.entries(attributes)) {
        modified[key] = values;
    }
    return modified;
}
/**
 * @summary Safely extract unit object from subworkflow data
 * @param subworkflowData {Object} subworkflow data
 * @param index {number} index of subworkflow unit
 * @param type {string} type of subworkflow unit
 * @returns {Object|null} subworkflow unit object (not a unit class instance!)
 */
function findUnit({ subworkflowData, index, type }) {
    const unit = subworkflowData.units[index];
    if (unit.type !== type)
        throw new Error("findUnit() error: unit type does not match!");
    return unit;
}
