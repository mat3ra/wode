import type { ApplicationSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
export declare function getUsedApplications(workflow: WorkflowSchema): ApplicationSchema[];
export declare function getSystemName(workflow: WorkflowSchema): string;
export declare function getUsedModels(workflow: WorkflowSchema): ("dft" | "ml" | "unknown")[];
export declare function getDefaultDescription(workflow: WorkflowSchema): string;
export declare function getProperties(workflow: WorkflowSchema): string[];
export declare function calculateHash(workflow: WorkflowSchema): string;
export declare function getHumanReadableProperties(workflow: WorkflowSchema): string[];
export declare function getHumanReadableUsedModels(workflow: WorkflowSchema): string[];
