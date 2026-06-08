import type { ErrorUnitSchema } from "@mat3ra/esse/dist/js/types";
import type { AnySubworkflowUnitSchema } from "../units/factory";
export declare function createErrorUnitData(unitData: AnySubworkflowUnitSchema | Record<string, unknown>, reason: string): ErrorUnitSchema;
