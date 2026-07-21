import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type Defaultable } from "@mat3ra/code/dist/js/entity/mixins/DefaultableMixin";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import { type NamedEntity } from "@mat3ra/code/dist/js/entity/mixins/NamedEntityMixin";
import { type RuntimeItems } from "@mat3ra/code/dist/js/entity/mixins/RuntimeItemsMixin";
import { type Taggable } from "@mat3ra/code/dist/js/entity/mixins/TaggableMixin";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { BaseInMemoryEntitySchema, StatusSchema, WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";
import { type BaseUnitSchemaMixin } from "../generated/BaseUnitSchemaMixin";
import { type StatusSchemaMixin } from "../generated/StatusSchemaMixin";
import { type RuntimeItemsUILogic } from "./mixins/RuntimeItemsUILogicMixin";
type Schema = WorkflowBaseUnitSchema;
export type UnitEntity<S extends Schema = Schema> = S & BaseInMemoryEntitySchema;
interface BaseUnitCore extends BaseUnitSchemaMixin, NamedEntity, StatusSchemaMixin, Defaultable, Taggable, HashedEntity, RuntimeItems, RuntimeItemsUILogic {
}
declare class BaseUnitCore extends InMemoryEntity<UnitEntity<Schema>> {
    defaultResults: NameResultSchema[];
    defaultMonitors: NameResultSchema[];
    defaultPostProcessors: NameResultSchema[];
    defaultPreProcessors: NameResultSchema[];
    repetition: number;
    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config: Partial<Schema> & Pick<Schema, "name">);
    get lastStatusUpdate(): {
        trackedAt: number;
        status: string;
        repetition?: number;
    };
    getHashObject(): object;
    isInStatus(status: StatusSchema["status"]): boolean;
    clone(extraContext: object): this;
    setRepetition(repetition: number): void;
}
declare class BaseUnit<S extends Schema = Schema> extends BaseUnitCore {
    _json: UnitEntity<S>;
    toJSON: (exclude?: (keyof UnitEntity<S>)[]) => UnitEntity<S>;
}
export default BaseUnit;
