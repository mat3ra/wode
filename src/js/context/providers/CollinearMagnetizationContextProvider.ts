import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { CollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Name = "collinearMagnetization";
type Data = CollinearMagnetizationContextProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data, object, ExternalContext> &
    Constructor<MaterialContextMixin>;

const jsonSchemaId = "context-providers-directory/collinear-magnetization-context-provider";

export default class CollinearMagnetizationContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "collinearMagnetization";

    readonly domain: Domain = "important";

    readonly jsonSchema: JSONSchema7 | undefined;

    private readonly isTotalMagnetization: boolean;

    private readonly firstElement: string;

    private readonly uniqueElementsWithLabels: string[];

    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);

        this.uniqueElementsWithLabels = [
            ...new Set(this.material?.Basis?.elementsWithLabelsArray || []),
        ];

        this.firstElement =
            this.uniqueElementsWithLabels?.length > 0 ? this.uniqueElementsWithLabels[0] : "";

        this.isTotalMagnetization = this.data?.isTotalMagnetization || false;

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "properties.startingMagnetization": {
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "properties.startingMagnetization.items.properties.atomicSpecies": {
                enum: this.uniqueElementsWithLabels,
                default: this.firstElement,
            },
            "properties.startingMagnetization.items.properties.value": {
                default: 0.0,
            },
            "properties.isTotalMagnetization": {
                default: false,
            },
            "properties.totalMagnetization": {
                default: 0.0,
            },
        });
    }

    getDefaultData(): Data {
        return {
            startingMagnetization: [
                {
                    index: 1,
                    atomicSpecies: this.firstElement,
                    value: 0.0,
                },
            ],
            isTotalMagnetization: false,
            totalMagnetization: 0.0,
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

materialContextMixin(CollinearMagnetizationContextProvider.prototype);
