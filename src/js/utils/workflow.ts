import type { ApplicationSchema, WorkflowSchema } from "@mat3ra/esse/dist/js/types";
import { MODEL_NAMES } from "@mat3ra/mode/dist/js/tree";
import { setUnitLinks } from "@mat3ra/standata";
import { Utils } from "@mat3ra/utils";
import s from "underscore.string";

import { calculateHash as calculateSubworkflowHash } from "./subworkflow";
import { calculateHash as calculateWorkflowUnitHash } from "./units";

export function getUsedApplications(workflow: WorkflowSchema): ApplicationSchema[] {
    const swApplications = workflow.subworkflows.map((sw) => sw.application);
    const nestedWorkflows = workflow.workflows as WorkflowSchema[];
    const wfApplications = nestedWorkflows.map(getUsedApplications).flat();

    return [...swApplications, ...wfApplications].reduce<ApplicationSchema[]>((acc, app) => {
        if (!acc.some((a) => a.name === app.name)) {
            acc.push(app);
        }
        return acc;
    }, []);
}

export function getSystemName(workflow: WorkflowSchema): string {
    const applicationNames = getUsedApplications(workflow).map((a) => a.name);
    return s.slugify(`${applicationNames.join(":")}-${workflow.name}`);
}

export function getUsedModels(workflow: WorkflowSchema) {
    return workflow.subworkflows.map((sw) => sw.model.type);
}

export function getDefaultDescription(workflow: WorkflowSchema): string {
    const applicationNames = getUsedApplications(workflow).map((a) => a.name);

    return `${getUsedModels(workflow)
        .join(", ")
        .toUpperCase()} workflow using ${applicationNames.join(", ")}.`;
}

export function getProperties(workflow: WorkflowSchema) {
    return [...new Set(workflow.subworkflows.map((sw) => sw.properties || []).flat())];
}

export function calculateHash(workflow: WorkflowSchema): string {
    return Utils.hash.calculateHashFromObject({
        units: setUnitLinks(workflow.units).map(calculateWorkflowUnitHash).join(),
        subworkflows: workflow.subworkflows.map(calculateSubworkflowHash).join(),
        workflows: (workflow.workflows as WorkflowSchema[]).map(calculateHash).join(),
    });
}

export function getHumanReadableProperties(workflow: WorkflowSchema) {
    return getProperties(workflow).map((name) =>
        name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" "),
    );
}

export function getHumanReadableUsedModels(workflow: WorkflowSchema) {
    return getUsedModels(workflow)
        .filter((m) => m !== "unknown")
        .map((m) => MODEL_NAMES[m]);
}
