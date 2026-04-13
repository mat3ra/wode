import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    CollinearMagnetizationContextItemSchema,
    CollinearMagnetizationContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Data = CollinearMagnetizationContextProviderSchema;
type Schema = CollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin>;

const defaultData = {
    value: 0.0,
    isTotalMagnetization: false,
    totalMagnetization: 0.0,
};

const jsonSchemaId = "context-providers-directory/collinear-magnetization-context-provider";

export default class CollinearMagnetizationDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "collinearMagnetization" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "collinearMagnetization");

        return new CollinearMagnetizationDataManager(contextItem, externalContext);
    }

    readonly jsonSchema: JSONSchema7;

    private readonly isTotalMagnetization: boolean;

    private readonly firstElement: string;

    private readonly uniqueElementsWithLabels: string[];

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);

        this.uniqueElementsWithLabels = [
            ...new Set(this.material?.Basis?.elementsWithLabelsArray || []),
        ];

        this.firstElement =
            this.uniqueElementsWithLabels?.length > 0 ? this.uniqueElementsWithLabels[0] : "";

        this.isTotalMagnetization = this.data?.isTotalMagnetization || false;

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "properties.startingMagnetization": {
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "properties.startingMagnetization.items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "properties.startingMagnetization.items.properties.value": {
                default: defaultData.value,
            },
            "properties.isTotalMagnetization": {
                default: defaultData.isTotalMagnetization,
            },
            "properties.totalMagnetization": {
                default: defaultData.totalMagnetization,
            },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    getDefaultData(): Data {
        return {
            startingMagnetization: [
                {
                    index: 1,
                    atomicSpecies: this.firstElement,
                    value: defaultData.value,
                },
            ],
            isTotalMagnetization: defaultData.isTotalMagnetization,
            totalMagnetization: defaultData.totalMagnetization,
        };
    }

    setData(data: Data) {
        const startingMagnetization = data.startingMagnetization.map((row) => ({
            ...row,
            index: this.uniqueElementsWithLabels.indexOf(row.atomicSpecies) + 1,
        }));

        super.setData({
            ...data,
            startingMagnetization,
        });
    }

    get uiSchemaStyled() {
        return {
            startingMagnetization: {
                items: {
                    atomicSpecies: {
                        "ui:classNames": "col-xs-3",
                    },
                    value: {
                        "ui:classNames": "col-xs-6",
                    },
                },
                "ui:readonly": this.isTotalMagnetization,
            },
            isTotalMagnetization: {},
            totalMagnetization: {
                "ui:classNames": "col-xs-6",
                "ui:readonly": !this.isTotalMagnetization,
            },
        };
    }
}

materialContextMixin(CollinearMagnetizationDataManager.prototype);
