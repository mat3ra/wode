import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import {
    type DefaultableInMemoryEntityConstructor,
    defaultableEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import {
    type NamedInMemoryEntityConstructor,
    namedEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type {
    ApplicationSchema,
    SubworkflowSchema,
    WorkflowSchema,
} from "@mat3ra/esse/dist/js/types";
import { tree } from "@mat3ra/mode";
import { setUnitLinks, SubworkflowStandata } from "@mat3ra/standata";
import { Utils } from "@mat3ra/utils";
import slugify from "slugify";

import type { MaterialExternalContext } from "./context/mixins/MaterialContextMixin";
import type { MaterialsExternalContext } from "./context/mixins/MaterialsContextMixin";
import type { MaterialsSetExternalContext } from "./context/mixins/MaterialsSetContextMixin";
import type { JobExternalContext } from "./context/providers/by_application/espresso/QEPWXInputDataManager";
import { UnitType } from "./enums";
import { type WorkflowSchemaMixin, workflowSchemaMixin } from "./generated/WorkflowSchemaMixin";
import Subworkflow from "./Subworkflow";
import { MapUnit } from "./units";
import { type AnyWorkflowUnit, UnitFactory } from "./units/factory";
import defaultWorkflowConfig from "./workflows/default";

const { MODEL_NAMES } = tree;

type Base = typeof InMemoryEntity &
    DefaultableInMemoryEntityConstructor &
    NamedInMemoryEntityConstructor &
    Constructor<WorkflowSchemaMixin>;

/** Context passed to Workflow.render() before workflow reference is injected for subworkflows. */
export type WorkflowRenderContext = MaterialExternalContext &
    MaterialsExternalContext &
    MaterialsSetExternalContext &
    JobExternalContext;

export class Workflow extends (InMemoryEntity as Base) {
    static usePredefinedIds = false;

    static readonly defaultConfig = defaultWorkflowConfig;

    static get jsonSchema() {
        return JSONSchemasInterface.getSchemaById("workflow");
    }

    subworkflowInstances: Subworkflow[];

    private unitInstances!: AnyWorkflowUnit[];

    private workflowInstances: Workflow[];

    static fromSubworkflow(subworkflow: Subworkflow) {
        const config = {
            name: subworkflow.name,
            subworkflows: [subworkflow.toJSON()],
            units: [subworkflow.getAsUnit().toJSON()],
            properties: subworkflow.properties,
            applicationName: subworkflow.application.name,
            workflows: [] as WorkflowSchema[],
        };
        return new Workflow(config);
    }

    constructor(config: WorkflowSchema & { applicationName?: string }) {
        super({
            ...config,
            _id: config._id || Utils.uuid.getUUID(),
        });

        this.subworkflowInstances = this.subworkflows.map((x) => new Subworkflow(x));
        this.workflowInstances = this.workflows?.map((x) => new Workflow(x)) || [];
        this.setUnits(this.units.map((unit) => UnitFactory.createInWorkflow(unit)));
    }

    get workflows() {
        return this.prop<WorkflowSchema[]>("workflows");
    }

    set workflows(value: WorkflowSchema[] | undefined) {
        this.setProp("workflows", value);
    }

    addSubworkflow(subworkflow: Subworkflow, head = false, index = -1) {
        const subworkflowUnit = subworkflow.getAsUnit();

        if (head) {
            this.subworkflowInstances.unshift(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        } else {
            this.subworkflowInstances.push(subworkflow);
            this.addUnit(subworkflowUnit, head, index);
        }
    }

    removeSubworkflow(id: string) {
        const subworkflowUnit = this.unitInstances.find((u) => u.id === id);

        if (subworkflowUnit) {
            this.removeUnit(subworkflowUnit.flowchartId);
        }
    }

    setUnits(arr: AnyWorkflowUnit[]) {
        this.unitInstances = setUnitLinks(arr);
    }

    render(context: WorkflowRenderContext) {
        this.subworkflowInstances.forEach((sw) => {
            sw.render({
                ...context,
                workflow: this,
            });
        });
    }

    get usedApplications(): ApplicationSchema[] {
        const swApplications = this.subworkflows.map((sw) => sw.application);
        const wfApplications = this.workflowInstances.map((w) => w.usedApplications).flat();

        const usedApplications = [...swApplications, ...wfApplications].reduce((acc, app) => {
            if (!acc.some((a) => a.name === app.name)) {
                acc.push(app);
            }
            return acc;
        }, [] as ApplicationSchema[]);

        return usedApplications;
    }

    // return application names
    get usedApplicationNames() {
        return this.usedApplications.map((a) => a.name);
    }

    get usedApplicationVersions() {
        return this.usedApplications.map((a) => a.version);
    }

    get usedApplicationNamesWithVersions() {
        return this.usedApplications.map((a) => `${a.name} ${a.version}`);
    }

    get usedModels() {
        return Array.from(new Set(this.subworkflows.map((sw) => sw.model.type)));
    }

    get humanReadableUsedModels() {
        return this.usedModels.filter((m) => m !== "unknown").map((m) => MODEL_NAMES[m]);
    }

    toJSON(): WorkflowSchema & AnyObject {
        return {
            ...super.toJSON(),
            name: this.name,
            properties: this.properties,
            units: this.unitInstances.map((x) => x.toJSON()),
            subworkflows: this.subworkflowInstances.map((x) => x.toJSON()),
            workflows: this.workflowInstances.map((x) => x.toJSON()),
        };
    }

    get properties() {
        return [...new Set(this.subworkflows.map((x) => x.properties || []).flat())];
    }

    get humanReadableProperties() {
        return this.properties.map((name) =>
            name
                .split("_")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" "),
        );
    }

    get systemName() {
        const applicationNames = this.usedApplications.map((a) => a.name);
        return slugify(`${applicationNames.join(":")}-${this.name.toLowerCase()}`);
    }

    get defaultDescription() {
        return `${this.usedModels.join(", ").toUpperCase()} workflow using ${this.usedApplications
            .map((a) => a.name)
            .join(", ")}.`;
    }

    private addUnit(unit: AnyWorkflowUnit, head = false, index = -1) {
        const [...unitInstances] = this.unitInstances;

        if (unitInstances.length === 0) {
            this.setUnits([unit]);
        } else {
            if (head) {
                unitInstances.unshift(unit);
            } else if (index >= 0) {
                unitInstances.splice(index, 0, unit);
            } else {
                unitInstances.push(unit);
            }
            this.setUnits(unitInstances);
        }
    }

    private removeUnit(flowchartId: string) {
        if (this.units.length < 2) {
            return;
        }

        const unit = this.unitInstances.find((x) => x.flowchartId === flowchartId);
        if (!unit) {
            return;
        }

        const previousUnit = this.unitInstances.find((x) => x.next === unit.flowchartId);
        if (previousUnit) {
            delete previousUnit.next;
        }

        this.subworkflowInstances = this.subworkflowInstances.filter((x) => x.id !== unit.id);

        this.setUnits(this.unitInstances.filter((x) => x.flowchartId !== flowchartId));
    }

    /*
     * @param type {String|Object} Unit type, map or subworkflow
     * @param head {Boolean}
     * @param index {Number} Index at which the unit will be added. -1 by default (ignored).
     */
    addUnitType(type: UnitType, head = false, index = -1) {
        switch (type) {
            case UnitType.map: {
                const mapWorkflowConfig = {
                    ...defaultWorkflowConfig,
                    _id: Utils.uuid.getUUID(),
                };
                const mapUnit = new MapUnit({
                    workflowId: mapWorkflowConfig._id,
                });

                this.workflows = [...(this.workflows || []), mapWorkflowConfig];
                this.workflowInstances = this.workflows.map((x) => new Workflow(x));

                this.addUnit(mapUnit, head, index);

                break;
            }
            case UnitType.subworkflow:
                this.addSubworkflow(Subworkflow.createDefault(), head, index);
                break;
            default:
                console.log(`unit_type=${type} unrecognized, skipping.`);
        }
    }

    addMapUnit(mapUnit: MapUnit, mapWorkflow: Workflow) {
        const mapWorkflowConfig = {
            _id: Utils.uuid.getUUID(),
            ...mapWorkflow.toJSON(),
        };

        mapUnit.setWorkflowId(mapWorkflowConfig._id);
        this.addUnit(mapUnit);

        this.workflows = [...(this.workflows || []), mapWorkflowConfig];
        this.workflowInstances = this.workflows.map((x) => new Workflow(x));
    }

    get allSubworkflows() {
        const subworkflowsList: Subworkflow[] = [];
        this.subworkflowInstances.forEach((sw) => subworkflowsList.push(sw));
        this.workflowInstances.forEach((workflow) => {
            return Array.prototype.push.apply(subworkflowsList, workflow.allSubworkflows);
        });
        return subworkflowsList;
    }

    /**
     * @summary Calculates hash of the workflow. Meaningful fields are units and subworkflows.
     * units and subworkflows must be sorted topologically before hashing (already sorted).
     */
    calculateHash(): string {
        const meaningfulFields = {
            units: this.unitInstances.map((u) => u.calculateHash()).join(),
            subworkflows: this.subworkflowInstances.map((sw) => sw.calculateHash()).join(),
            workflows: this.workflowInstances.map((w) => w.calculateHash()).join(),
        };
        return Utils.hash.calculateHashFromObject(meaningfulFields);
    }

    get hasRelaxation() {
        return Boolean(this.getRelaxationSubworkflow());
    }

    toggleRelaxation() {
        const relaxSubworkflow = this.getRelaxationSubworkflow();
        if (relaxSubworkflow?._id) {
            this.removeSubworkflow(relaxSubworkflow._id);
        } else {
            const vcRelax = this.getStandataRelaxationSubworkflow();
            if (vcRelax) {
                this.addSubworkflow(new Subworkflow(vcRelax), true);
            }
        }
    }

    private getStandataRelaxationSubworkflow() {
        // TODO: fix standata type
        return new SubworkflowStandata().getRelaxationSubworkflowByApplication(
            this.subworkflowInstances[0].application.name,
        ) as unknown as SubworkflowSchema;
    }

    private getRelaxationSubworkflow() {
        const standataSubworkflow = this.getStandataRelaxationSubworkflow();

        return this.subworkflows.find((sw) => {
            return standataSubworkflow && standataSubworkflow.systemName === sw.systemName;
        });
    }
}

namedEntityMixin(Workflow.prototype);
defaultableEntityMixin(Workflow);
workflowSchemaMixin(Workflow.prototype);
