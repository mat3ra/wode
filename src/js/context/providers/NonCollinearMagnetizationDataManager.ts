import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type {
    NonCollinearMagnetizationContextItemSchema,
    NonCollinearMagnetizationContextProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../mixins/MaterialContextMixin";
import type { UnitContext } from "./base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "./base/JSONSchemaDataProvider";

type Data = NonCollinearMagnetizationContextProviderSchema;
type Schema = NonCollinearMagnetizationContextItemSchema;
type ExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext> &
    Constructor<MaterialContextMixin>;

const defaultData = {
    isExistingChargeDensity: false,
    isStartingMagnetization: true,
    isConstrainedMagnetization: false,
    isArbitrarySpinAngle: false,
    isArbitrarySpinDirection: false,
    isFixedMagnetization: false,
    lforcet: true,
    value: 0.0,
    angle1: 0.0,
    angle2: 0.0,
    constrainType: "atomic direction" as const,
    lambda: 0.0,
    fixedMagnetizationX: 0.0,
    fixedMagnetizationY: 0.0,
    fixedMagnetizationZ: 0.0,
};

const jsonSchemaId = "context-providers-directory/non-collinear-magnetization-context-provider";

export default class NonCollinearMagnetizationDataManager extends (JSONSchemaDataProvider as Base) {
    readonly name = "nonCollinearMagnetization" as const;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "nonCollinearMagnetization");

        return new NonCollinearMagnetizationDataManager(contextItem, externalContext);
    }

    readonly isStartingMagnetization: boolean;

    readonly isConstrainedMagnetization: boolean;

    readonly isExistingChargeDensity: boolean;

    readonly isArbitrarySpinDirection: boolean;

    readonly isFixedMagnetization: boolean;

    readonly constrainedMagnetization: Data["constrainedMagnetization"];

    readonly jsonSchema: JSONSchema7;

    private readonly uniqueElementsWithLabels: string[];

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
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

        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            isExistingChargeDensity: { default: defaultData.isExistingChargeDensity },
            isStartingMagnetization: { default: defaultData.isStartingMagnetization },
            isArbitrarySpinAngle: { default: defaultData.isArbitrarySpinAngle },
            isConstrainedMagnetization: { default: defaultData.isConstrainedMagnetization },
            isFixedMagnetization: { default: defaultData.isFixedMagnetization },
            startingMagnetization: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "startingMagnetization.items.properties.value": {
                default: defaultData.value,
                minimum: -1.0,
                maximum: 1.0,
            },
            spinAngles: {
                minItems: this.uniqueElementsWithLabels.length,
                maxItems: this.uniqueElementsWithLabels.length,
            },
            "spinAngles.items.properties.angle1": { default: defaultData.angle1 },
            "spinAngles.items.properties.angle2": { default: defaultData.angle2 },
            "constrainedMagnetization.properties.constrainType": {
                default: defaultData.constrainType,
            },
            "constrainedMagnetization.properties.lambda": { default: defaultData.lambda },
            "fixedMagnetization.properties.x": { default: defaultData.fixedMagnetizationX },
            "fixedMagnetization.properties.y": { default: defaultData.fixedMagnetizationY },
            "fixedMagnetization.properties.z": { default: defaultData.fixedMagnetizationZ },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        this.jsonSchema = jsonSchema;
    }

    getDefaultData(): Data {
        const startingMagnetization = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                value: defaultData.value,
            };
        });

        const spinAngles = this.uniqueElementsWithLabels.map((element, index) => {
            return {
                index: index + 1,
                atomicSpecies: element,
                angle1: defaultData.angle1,
                angle2: defaultData.angle2,
            };
        });

        return {
            isExistingChargeDensity: defaultData.isExistingChargeDensity,
            isStartingMagnetization: defaultData.isStartingMagnetization,
            isConstrainedMagnetization: defaultData.isConstrainedMagnetization,
            isArbitrarySpinAngle: defaultData.isArbitrarySpinAngle,
            isArbitrarySpinDirection: defaultData.isArbitrarySpinDirection,
            isFixedMagnetization: defaultData.isFixedMagnetization,
            lforcet: defaultData.lforcet,
            spinAngles,
            startingMagnetization,
            constrainedMagnetization: {
                lambda: defaultData.lambda,
                constrainType: defaultData.constrainType,
            },
            fixedMagnetization: {
                x: defaultData.fixedMagnetizationX,
                y: defaultData.fixedMagnetizationY,
                z: defaultData.fixedMagnetizationZ,
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

materialContextMixin(NonCollinearMagnetizationDataManager.prototype);
