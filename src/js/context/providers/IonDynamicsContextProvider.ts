import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { IonDynamicsContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import type { ContextItem, Domain, ExternalContext } from "./base/ContextProvider";
import JSONSchemaFormDataProvider from "./base/JSONSchemaFormDataProvider";

type Data = IonDynamicsContextProviderSchema;
type Name = "dynamics";

const jsonSchemaId = "context-providers-directory/ion-dynamics-context-provider";

const defaultData = {
    numberOfSteps: 100,
    timeStep: 5.0,
    electronMass: 100.0,
    temperature: 300.0,
};

export default class IonDynamicsContextProvider extends JSONSchemaFormDataProvider<Name, Data> {
    readonly name: Name = "dynamics";

    readonly domain: Domain = "important";

    readonly uiSchema = {
        numberOfSteps: {},
        timeStep: {},
        electronMass: {},
        temperature: {},
    };

    readonly jsonSchema: JSONSchema7 | undefined;

    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            numberOfSteps: { default: defaultData.numberOfSteps },
            timeStep: { default: defaultData.timeStep },
            electronMass: { default: defaultData.electronMass },
            temperature: { default: defaultData.temperature },
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getDefaultData() {
        return defaultData;
    }
}
