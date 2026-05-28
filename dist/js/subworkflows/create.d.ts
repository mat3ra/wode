/**
 * @summary Create workflow unit from JSON configuration
 *      Supports applying functions to the builder prior to building via "functions"
 *      Supports applying attributes to the builder after building via "attributes"
 * @param config {Object} unit config
 * @param application {*} application
 * @param unitBuilders {Object} workflow unit builders
 * @param unitFactoryCls {*} workflow unit class factory
 * @returns {*|{head: boolean, preProcessors: [], postProcessors: [], name: *, flowchartId: *, type: *, results: [], monitors: []}}
 */
export function createUnit({ config, application, unitBuilders, unitFactoryCls, cache }: Object): any | {
    head: boolean;
    preProcessors: [];
    postProcessors: [];
    name: any;
    flowchartId: any;
    type: any;
    results: [];
    monitors: [];
};
export function createSubworkflow({ subworkflowData, cache, AppRegistry, modelFactoryCls, methodFactoryCls, subworkflowCls, unitFactoryCls, unitBuilders, }: {
    subworkflowData: any;
    cache?: never[] | undefined;
    AppRegistry?: typeof ApplicationRegistry | undefined;
    modelFactoryCls?: typeof ModelFactory | undefined;
    methodFactoryCls?: typeof MethodFactory | undefined;
    subworkflowCls?: typeof Subworkflow | undefined;
    unitFactoryCls?: typeof UnitFactory | undefined;
    unitBuilders?: {
        UnitConfigBuilder: typeof import("../units/builders/UnitConfigBuilder").UnitConfigBuilder;
        AssignmentUnitConfigBuilder: typeof import("../units/builders/AssignmentUnitConfigBuilder").AssignmentUnitConfigBuilder;
        AssertionUnitConfigBuilder: typeof import("../units/builders/AssertionUnitConfigBuilder").AssertionUnitConfigBuilder;
        ExecutionUnitConfigBuilder: typeof import("../units/builders/ExecutionUnitConfigBuilder").ExecutionUnitConfigBuilder;
        IOUnitConfigBuilder: typeof import("../units/builders/IOUnitConfigBuilder").IOUnitConfigBuilder;
    } | undefined;
}): Subworkflow;
/**
 * @summary Convenience wrapper around createSubworkflow to create by app name and swf name
 * @param appName {String} application name
 * @param swfName {String} subworkflow name (snake_case.yml)
 * @param workflowSubworkflowMapByApplication {Object} object containing all workflow/subworkflow map by application
 * @param swArgs {Object} classes for instantiation
 * @returns {*} subworkflow object
 */
export function createSubworkflowByName({ appName, swfName, workflowSubworkflowMapByApplication, ...swArgs }: string): any;
import { ApplicationRegistry } from "@mat3ra/ade";
import { ModelFactory } from "@mat3ra/mode";
import { MethodFactory } from "@mat3ra/mode";
import { Subworkflow } from "./subworkflow";
import { UnitFactory } from "../units";
