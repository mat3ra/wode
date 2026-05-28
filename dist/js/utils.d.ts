/**
 * @summary set the head of an array of units
 * @param units
 * @returns {Unit[]}
 */
export function setUnitsHead(units: any): Unit[];
/**
 * @summary Re-establishes the linked `next => flowchartId` logic in an array of units
 * @params units {Unit[]}
 * @returns units {Unit[]}
 */
export function setNextLinks(units: any): any;
/**
 * @summary Apply configuration data to an object
 * @param obj {*} object / class containing methods or attributes to be set
 * @param config { functions: {}, attributes: {} } functions to call and attributes to set
 * @param callBuild {boolean} if true; call build between applying functions and attributes
 * @returns {*} updated object
 */
export function applyConfig({ obj, config, callBuild }: any): any;
/**
 * @summary Safely extract unit object from subworkflow data
 * @param subworkflowData {Object} subworkflow data
 * @param index {number} index of subworkflow unit
 * @param type {string} type of subworkflow unit
 * @returns {Object|null} subworkflow unit object (not a unit class instance!)
 */
export function findUnit({ subworkflowData, index, type }: Object): Object | null;
