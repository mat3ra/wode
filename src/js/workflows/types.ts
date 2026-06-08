import type { WorkflowSchema as EsseWorkflowSchema } from "@mat3ra/esse/dist/js/types";

export type WorkflowSchema = EsseWorkflowSchema & {
    workflows: WorkflowSchema[];
};
