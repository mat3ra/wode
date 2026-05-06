import type { WorkflowBaseUnitSchema } from "@mat3ra/esse/dist/js/types";

import { UnitStatus } from "../enums";

export function resetStatus<T extends WorkflowBaseUnitSchema>(unit: T) {
    return {
        ...unit,
        status: UnitStatus.idle,
        statusTrack: [],
    };
}
