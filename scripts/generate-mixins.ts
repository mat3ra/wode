#!/usr/bin/env node

/**
 * Script to generate mixin properties from JSON schema
 *
 * This script generates mixin functions for property/holder, property/meta_holder,
 * and property/proto_holder schemas automatically.
 *
 * Usage:
 *   npx ts-node scripts/generate-mixin-properties.ts
 */

import generateSchemaMixin from "@mat3ra/code/dist/js/generateSchemaMixin";
import allSchemas from "@mat3ra/esse/dist/js/schemas.json";
import type { JSONSchema7 } from "json-schema";

/**
 * Output file paths for each schema
 */
const OUTPUT_PATHS = {
    "workflow/unit/mixins/base": "src/js/generated/BaseUnitSchemaMixin.ts",
    "system/status": "src/js/generated/StatusSchemaMixin.ts",
    "workflow/unit/mixins/assertion": "src/js/generated/AssertionUnitSchemaMixin.ts",
    "workflow/unit/mixins/assignment": "src/js/generated/AssignmentUnitSchemaMixin.ts",
    "workflow/unit/mixins/condition": "src/js/generated/ConditionUnitSchemaMixin.ts",
    "workflow/unit/mixins/execution": "src/js/generated/ExecutionUnitSchemaMixin.ts",
    "workflow/unit/mixins/io": "src/js/generated/IOUnitSchemaMixin.ts",
    "workflow/unit/mixins/map": "src/js/generated/MapUnitSchemaMixin.ts",
    "workflow/unit/mixins/reduce": "src/js/generated/ReduceUnitSchemaMixin.ts",
    "workflow/unit/mixins/subworkflow": "src/js/generated/SubworkflowUnitSchemaMixin.ts",
    "workflow/unit/input/-inputItem": "src/js/generated/ExecutionUnitInputSchemaMixin.ts",
    "workflow/subworkflow/mixin": "src/js/generated/SubworkflowSchemaMixin.ts",
    "workflow/base": "src/js/generated/WorkflowSchemaMixin.ts",
};

function main() {
    // Type assertion to handle schema compatibility - the schemas from esse may have slightly different types
    const result = generateSchemaMixin(allSchemas as JSONSchema7[], OUTPUT_PATHS);

    if (result.errorCount > 0) {
        process.exit(1);
    }
}

// Run the script if it's executed directly
main();
