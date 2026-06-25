import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { NameResultSchema } from "@mat3ra/code/dist/js/utils/object";
import type { BaseInMemoryEntitySchema, StatusSchema, WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";
type Schema = WorkflowBaseUnitSchema;
export type UnitEntity<S extends Schema = Schema> = S & BaseInMemoryEntitySchema;
declare class BaseUnit extends InMemoryEntity<UnitEntity<Schema>> {
    defaultResults: NameResultSchema[];
    defaultMonitors: NameResultSchema[];
    defaultPostProcessors: NameResultSchema[];
    defaultPreProcessors: NameResultSchema[];
    repetition: number;
    /**
     * @param config — `flowchartId` is optional; when absent, a new UUID is generated.
     */
    constructor(config: Partial<Schema> & Pick<Schema, "name">);
    get lastStatusUpdate(): any;
    getHashObject(): object;
    isInStatus(status: StatusSchema["status"]): boolean;
    clone(extraContext: object): this;
    setRepetition(repetition: number): void;
}
export default BaseUnit;
