import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { PlanewaveCutoffsContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import {
    type ApplicationContextMixin,
    applicationContextMixin,
} from "../mixins/ApplicationContextMixin";
import ContextProvider, {
    type ContextItem,
    type Domain,
    type EntityName,
    type ExternalContext,
} from "./base/ContextProvider";

type ApplicationName = "vasp" | "espresso";

type Name = "cutoffs";
type Data = PlanewaveCutoffsContextProviderSchema;
type PlanewaveExternalContext = ExternalContext & ApplicationContextMixin;
type Base = typeof ContextProvider<Name, Data> & Constructor<ApplicationContextMixin>;

const cutoffConfig: Record<ApplicationName, { wavefunction?: number; density?: number }> = {
    vasp: { wavefunction: undefined, density: undefined },
    espresso: { wavefunction: 40, density: 200 },
};

const jsonSchemaId = "context-providers-directory/planewave-cutoffs-context-provider";

export default class PlanewaveCutoffsContextProvider extends (ContextProvider as Base) {
    readonly name: Name = "cutoffs";

    readonly domain: Domain = "important";

    readonly entityName: EntityName = "subworkflow";

    readonly jsonSchema: JSONSchema7 | undefined;

    readonly uiSchema = {
        wavefunction: {},
        density: {},
    };

    constructor(contextItem: ContextItem<Data>, externalContext: PlanewaveExternalContext) {
        super(contextItem, externalContext);
        this.initApplicationContextMixin(externalContext);

        const { wavefunction, density } = this.getDefaultData();

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            wavefunction: { default: wavefunction },
            density: { default: density },
        });
    }

    getDefaultData() {
        // TODO-QUESTION: what if the application is not in the cutoffConfig?
        const { wavefunction, density } =
            cutoffConfig[this.application.name as ApplicationName] || {};

        return {
            wavefunction,
            density,
        };
    }
}

applicationContextMixin(PlanewaveCutoffsContextProvider.prototype);
