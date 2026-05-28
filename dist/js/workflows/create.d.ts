export function createWorkflow({ appName, workflowData, workflowSubworkflowMapByApplication, workflowCls, ...swArgs }: {
    [x: string]: any;
    appName: any;
    workflowData: any;
    workflowSubworkflowMapByApplication: any;
    workflowCls?: typeof Workflow | undefined;
}): any[];
import { Workflow } from "./workflow";
