import { math as codeJSMath } from "@mat3ra/code/dist/js/math";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { JSONSchema } from "@mat3ra/esse/dist/js/esse/utils";
import type {
    PathContextItemSchema,
    PointsPathDataProviderRenderingSchema,
    PointsPathDataProviderSchema,
} from "@mat3ra/esse/dist/js/types";
import { type ReciprocalLattice, Made } from "@mat3ra/made";

import applicationContextMixin, {
    type ApplicationContextMixin,
    type ApplicationExternalContext,
} from "../../mixins/ApplicationContextMixin";
import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../mixins/MaterialContextMixin";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";

const defaultPoint = "Г" as const;
const defaultSteps = 10 as const;

export type PointsPathFormDataProviderData = PointsPathDataProviderSchema;
export type PointsPathFormDataProviderRenderingData = PointsPathDataProviderRenderingSchema;
export type PointsPathFormDataProviderExternalContext = JinjaExternalContext &
    MaterialExternalContext &
    ApplicationExternalContext;

type Data = PointsPathFormDataProviderData;
type RenderingData = PointsPathFormDataProviderRenderingData;
type RenderingDataItem = RenderingData[0];
type Schema = PathContextItemSchema;
type ExternalContext = PointsPathFormDataProviderExternalContext;

const jsonSchemaId = "context-providers-directory/points-path-data-provider";

type Base = typeof JSONSchemaDataProvider<Schema, ExternalContext, RenderingData> &
    Constructor<MaterialContextMixin> &
    Constructor<ApplicationContextMixin>;

abstract class MixinsContextProvider extends (JSONSchemaDataProvider as Base) {
    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initApplicationContextMixin(externalContext);
    }
}

materialContextMixin(MixinsContextProvider.prototype);
applicationContextMixin(MixinsContextProvider.prototype);

abstract class PointsPathFormDataProvider<N extends Schema["name"]> extends MixinsContextProvider {
    abstract name: N;

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    private reciprocalLattice: ReciprocalLattice;

    readonly useExplicitPath: boolean;

    readonly is2PIBA: boolean = false;

    constructor(config: Partial<Schema>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.reciprocalLattice = new Made.ReciprocalLattice(this.material.lattice);
        this.useExplicitPath = this.application.name === "vasp";
    }

    getDefaultData(): Data {
        return this.reciprocalLattice.defaultKpointPath as Data;
    }

    updateMaterialHash() {
        super.updateMaterialHash();

        // Workaround: Material.createDefault() used to initiate workflow reducer and hence here too
        //  does not have an id. Here we catch when such material is used and avoid resetting isEdited
        const isMaterialCreatedDefault = !this.material.id;
        const isMaterialUpdated = this.extraData?.materialHash !== this.material.hash;

        if (isMaterialUpdated || isMaterialCreatedDefault) {
            this.isEdited = false;
        }
    }

    get jsonSchema(): JSONSchema {
        const jsonSchema = JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.point": {
                default: defaultPoint,
                enum: this.reciprocalLattice.symmetryPoints.map((x) => x.point),
            },
            "items.properties.steps": {
                default: defaultSteps,
            },
        });

        if (!jsonSchema) {
            throw new Error("Failed to get patched JSON schema");
        }

        return jsonSchema;
    }

    readonly uiSchemaStyled = {
        items: {
            point: {},
            steps: {},
        },
    };

    protected patchForRendering(data: Data): RenderingData {
        return this.addCoordinates(data);
    }

    private addCoordinates(path: Data): RenderingData {
        const rawData: RenderingDataItem[] = path.map((pathItem) => {
            const point = this.reciprocalLattice.symmetryPoints.find((sp) => {
                return sp.point === pathItem.point;
            });
            if (!point) {
                throw new Error(`Point ${pathItem.point} not found in reciprocal lattice`);
            }
            return { ...pathItem, coordinates: point.coordinates };
        });

        const processedData = this.useExplicitPath ? this.convertToExplicitPath(rawData) : rawData;

        const mapped = processedData.map((p) => {
            const coordinates = this.is2PIBA
                ? this.reciprocalLattice.getCartesianCoordinates(p.coordinates)
                : p.coordinates;

            return {
                ...p,
                coordinates: coordinates.map((c) => Number(c.toFixed(9))),
            };
        });

        return mapped as RenderingData;
    }

    // Initially, path contains symmetry points with steps counts.
    // This function explicitly calculates each point between symmetry points by step counts.
    // eslint-disable-next-line class-methods-use-this
    private convertToExplicitPath(path: RenderingDataItem[]): RenderingDataItem[] {
        return path.reduce<RenderingDataItem[]>((acc, startPoint, index) => {
            const nextPoint = path[index + 1];

            if (!nextPoint) {
                return acc;
            }

            const middlePoints = codeJSMath.calculateSegmentsBetweenPoints3D(
                startPoint.coordinates,
                nextPoint.coordinates,
                startPoint.steps,
            );

            const steps = 1;

            acc.push(
                {
                    steps,
                    coordinates: startPoint.coordinates,
                    point: startPoint.point,
                },
                ...middlePoints.map((coordinates) => ({
                    steps,
                    coordinates,
                    point: startPoint.point,
                })),
            );

            // nextPoint is the last point in the path
            if (path.length - 2 === index) {
                acc.push({
                    steps,
                    coordinates: nextPoint.coordinates,
                    point: nextPoint.point,
                });
            }

            return acc;
        }, []);
    }
}

export default PointsPathFormDataProvider;
