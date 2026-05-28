import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { NonCollinearMagnetizationContextProviderSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Name = "nonCollinearMagnetization";
type Data = NonCollinearMagnetizationContextProviderSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Name, Data> & Constructor<MaterialContextMixin>;

const jsonSchemaId = "context-providers-directory/non-collinear-magnetization-context-provider";

export default class NonCollinearMagnetizationContextProvider extends (JSONSchemaDataProvider as Base) {
    readonly name: Name = "nonCollinearMagnetization";

    readonly domain: Domain = "important";

    readonly isStartingMagnetization: boolean;

    readonly isConstrainedMagnetization: boolean;

    readonly isExistingChargeDensity: boolean;

    readonly isArbitrarySpinDirection: boolean;

    readonly isFixedMagnetization: boolean;

    readonly constrainedMagnetization: Data["constrainedMagnetization"];

    readonly jsonSchema: JSONSchema7 | undefined;

    private readonly uniqueElementsWithLabels: string[];

    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);

        this.isStartingMagnetization = this.data?.isStartingMagnetization ?? true;
        this.isConstrainedMagnetization = this.data?.isConstrainedMagnetization ?? false;
        this.isExistingChargeDensity = this.data?.isExistingChargeDensity ?? false;
        this.isArbitrarySpinDirection = this.data?.isArbitrarySpinDirection ?? false;
        this.isFixedMagnetization = this.data?.isFixedMagnetization ?? false;
        this.constrainedMagnetization = this.data?.constrainedMagnetization ?? {
            lambda: 0.0,
            constrainType: "atomic direction" as const,
        };
        this.uniqueElementsWithLabels = [
            ...new Set(this.material?.Basis?.elementsWithLabelsArray || []),
        ];

        this.jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            isExistingChargeDensity: { default: false },
            isStartingMagnetization: { default: true },
            isArbitrarySpinAngle: { default: false },
            isConstrainedMagnetization: { default: false },
            isFixedMagnetization: { default: true },
            startingMagnetization: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "startingMagnetization.items.properties.value": {
                default: 0.0,
                minimum: -1.0,
                maximum: 1.0,
            },
            spinAngles: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "spinAngles.items.properties.angle1": { default: 0.0 },
            "spinAngles.items.properties.angle2": { default: 0.0 },
            "constrainedMagnetization.properties.constrainType": {
                default: "atomic direction",
            },
            "constrainedMagnetization.properties.lambda": { default: 0.0 },
            "fixedMagnetization.properties.x": { default: 0.0 },
            "fixedMagnetization.properties.y": { default: 0.0 },
            "fixedMagnetization.properties.z": { default: 0.0 },
        });
    }

    getDefaultData(): Data {
        const startingMagnetization = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                value: 0.0,
            };
        });

        const spinAngles = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                angle1: 0.0,
                angle2: 0.0,
            };
        });

        return {
            isExistingChargeDensity: false,
            isStartingMagnetization: true,
            isConstrainedMagnetization: false,
            isArbitrarySpinAngle: false,
            isArbitrarySpinDirection: false,
            isFixedMagnetization: false,
            lforcet: true,
            spinAngles,
            startingMagnetization,
            constrainedMagnetization: {
                lambda: 0.0,
                constrainType: "atomic direction",
            },
            fixedMagnetization: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
        };
    }

    get uiSchemaStyled() {
        return {
            isExistingChargeDensity: {},
            lforcet: {
                "ui:readonly": !this.isExistingChargeDensity,
                "ui:widget": "radio",
                "ui:options": {
                    inline: true,
                },
            },
            isArbitrarySpinDirection: {},
            spinAngles: {
                items: {
                    atomicSpecies: {
                        "ui:readonly": true,
                    },
                },
                "ui:readonly": !this.isArbitrarySpinDirection,
                "ui:options": {
                    addable: false,
                    orderable: false,
                    removable: false,
                },
            },
            isStartingMagnetization: {},
            startingMagnetization: {
                items: {
                    atomicSpecies: {
                        "ui:readonly": true,
                    },
                    value: {
                        "ui:classNames": "col-xs-6",
                    },
                },
                "ui:readonly": !this.isStartingMagnetization,
                "ui:options": {
                    addable: false,
                    orderable: false,
                    removable: false,
                },
            },
            isConstrainedMagnetization: {},
            constrainedMagnetization: {
                "ui:readonly": !this.isConstrainedMagnetization,
            },
            isFixedMagnetization: {
                "ui:readonly": !(
                    this.isConstrainedMagnetization &&
                    this.constrainedMagnetization?.constrainType === "total"
                ),
            },
            fixedMagnetization: {
                "ui:readonly": !(
                    this.isFixedMagnetization &&
                    this.isConstrainedMagnetization &&
                    this.constrainedMagnetization?.constrainType === "total"
                ),
            },
        };
    }
}

materialContextMixin(NonCollinearMagnetizationContextProvider.prototype);
