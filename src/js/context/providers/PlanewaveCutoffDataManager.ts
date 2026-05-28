import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { CutoffsContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import applicationContextMixin, {
    type ApplicationContextMixin,
    type ApplicationExternalContext,
} from "../mixins/ApplicationContextMixin";
import ContextProvider, {
    type BaseExternalContext,
    type UnitContext,
} from "./base/ContextProvider";

type ApplicationName = "vasp" | "espresso";

type Schema = CutoffsContextItemSchema;
type PlanewaveExternalContext = BaseExternalContext & ApplicationExternalContext;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PlanewaveCutoffDataManager extends ApplicationContextMixin {}

// Type guard to check if a string is a valid ApplicationName
function isApplicationName(name: string): name is ApplicationName {
    return name === "vasp" || name === "espresso";
}

// TODO: create a task to move this handling to standata
const cutoffConfig: Record<ApplicationName, { wavefunction?: number; density?: number }> = {
    vasp: { wavefunction: undefined, density: undefined },
    espresso: { wavefunction: 40, density: 200 },
};

const defaultData = {
    wavefunction: undefined,
    density: undefined,
};

const jsonSchemaId = "context-providers-directory/planewave-cutoffs-context-provider";

class PlanewaveCutoffDataManager extends ContextProvider<Schema, PlanewaveExternalContext> {
    readonly name = "cutoffs" as const;

    readonly domain = "important" as const;

    readonly entityName = "subworkflow" as const;

    readonly jsonSchema: JSONSchema7;

    readonly uiSchema = {
        wavefunction: {},
        density: {},
    } as const;

    readonly extraData = {};

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PlanewaveExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "cutoffs");

        return new PlanewaveCutoffDataManager(contextItem, externalContext);
    }

    constructor(contextItem: Partial<Schema>, externalContext: PlanewaveExternalContext) {
        super(contextItem, externalContext);
        this.initApplicationContextMixin(externalContext);

        const { wavefunction, density } = this.getDefaultData();

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            wavefunction: { default: wavefunction },
            density: { default: density },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    getDefaultData() {
        const applicationName = this.application.name;

        // Type-safe check: ensure application name is valid and exists in config
        if (!isApplicationName(applicationName)) {
            // Fallback to default values if application is not supported
            return defaultData;
        }

        const config = cutoffConfig[applicationName];

        if (!config) {
            // Fallback to default values if application is not in cutoffConfig
            return defaultData;
        }

        const { wavefunction, density } = config;

        return {
            wavefunction: wavefunction ?? defaultData.wavefunction,
            density: density ?? defaultData.density,
        };
    }
}

applicationContextMixin(PlanewaveCutoffDataManager.prototype);

export default PlanewaveCutoffDataManager;
