"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("@mat3ra/code/dist/js/entity");
const InMemoryEntityInSetMixin_1 = require("@mat3ra/code/dist/js/entity/set/InMemoryEntityInSetMixin");
const OrderedInMemoryEntityInSetMixin_1 = require("@mat3ra/code/dist/js/entity/set/ordered/OrderedInMemoryEntityInSetMixin");
const made_1 = require("@mat3ra/made");
/**
 * `Material` with `OrderedInMemoryEntityInSet` for workflow designer / map nested `Workflow.render`
 * (expects `OrderedMaterial` in render context), mirroring app materials that use ordered-set mixins.
 */
class WorkflowDesignerMaterial extends made_1.Material {
    constructor(config = {}) {
        super(config instanceof entity_1.InMemoryEntity ? config.toJSON() : config);
        this.setProp("inSet", this.prop("inSet", []));
    }
    static createDefault() {
        return new WorkflowDesignerMaterial(made_1.defaultMaterialConfig);
    }
    /** Wrap any `Material` as `OrderedMaterial` for `Workflow.render`. */
    static fromMaterial(material) {
        return new WorkflowDesignerMaterial(material.toJSON());
    }
}
(0, InMemoryEntityInSetMixin_1.inMemoryEntityInSetMixin)(WorkflowDesignerMaterial.prototype);
(0, OrderedInMemoryEntityInSetMixin_1.orderedEntityInSetMixin)(WorkflowDesignerMaterial.prototype);
exports.default = WorkflowDesignerMaterial;
