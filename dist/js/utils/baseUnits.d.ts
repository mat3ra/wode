import type { WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";
import { UnitStatus } from "../enums";
export declare function resetStatus<T extends WorkflowBaseUnitSchema>(unit: T): T & {
    status: UnitStatus;
    statusTrack: never[];
};
