import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type InMemoryEntityInSet } from "@mat3ra/code/dist/js/entity/set/InMemoryEntityInSetMixin";
import type { OrderedInMemoryEntityInSet } from "@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin";
import type { ConsistencyCheck, MaterialSchema } from "@mat3ra/esse/dist/js/types";
import { Material } from "@mat3ra/made";
type Schema = Omit<MaterialSchema, "consistencyChecks"> & {
    consistencyChecks?: ConsistencyCheck[];
};
interface WorkflowDesignerMaterial extends InMemoryEntityInSet, OrderedInMemoryEntityInSet {
}
/**
 * `Material` with `OrderedInMemoryEntityInSet` for workflow designer / map nested `Workflow.render`
 * (expects `OrderedMaterial` in render context), mirroring app materials that use ordered-set mixins.
 */
declare class WorkflowDesignerMaterial extends Material implements Schema {
    constructor(config?: object | InMemoryEntity);
    static createDefault(): WorkflowDesignerMaterial;
    /** Wrap any `Material` as `OrderedMaterial` for `Workflow.render`. */
    static fromMaterial(material: Material): WorkflowDesignerMaterial;
}
export default WorkflowDesignerMaterial;
