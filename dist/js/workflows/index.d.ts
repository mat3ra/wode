import { Workflow } from "./workflow";
export function createWorkflows({ appName, workflowCls, workflowSubworkflowMapByApplication, ...swArgs }: {
    [x: string]: any;
    appName?: null | undefined;
    workflowCls?: typeof Workflow | undefined;
    workflowSubworkflowMapByApplication: any;
}): any[];
/**
 * @summary Create workflow configurations for all applications
 * @param applications {Array<String>} array of application names
 * @param workflowCls {*} workflow class to instantiate
 * @param workflowSubworkflowMapByApplication {Object} object containing all workflow/subworkflow map by application
 * @param swArgs {Object} other classes for instantiation
 * @returns {Array<Object>} array of workflow configurations
 */
export function createWorkflowConfigs({ applications, workflowCls, workflowSubworkflowMapByApplication, ...swArgs }: Array<string>): Array<Object>;
import { createWorkflow } from "./create";
export { Workflow, createWorkflow };
