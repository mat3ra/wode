import { math as codeJSMath } from "@mat3ra/code/dist/js/math";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import JSONSchemasInterface from "@mat3ra/esse/dist/js/esse/JSONSchemasInterface";
import type { PointsPathDataProviderSchema } from "@mat3ra/esse/dist/js/types";
import { type ReciprocalLattice, Made } from "@mat3ra/made";
import s from "underscore.string";

import {
    type ApplicationContextMixin,
    applicationContextMixin,
} from "../../mixins/ApplicationContextMixin";
import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";

const defaultPoint = "Г" as const;
const defaultSteps = 10 as const;

type Data = PointsPathDataProviderSchema; // same as KPointCoordinates
type DataItem = Data[0];
type ExternalContext = JinjaExternalContext & MaterialExternalContext & ApplicationContextMixin;
type Base = typeof JSONSchemaDataProvider<string, Data> &
    Constructor<MaterialContextMixin> &
    Constructor<ApplicationContextMixin>;

const jsonSchemaId = "context-providers-directory/points-path-data-provider";

abstract class MixinsContextProvider extends (JSONSchemaDataProvider as Base) {
    constructor(contextItem: ContextItem<Data>, externalContext: ExternalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initApplicationContextMixin(externalContext);
    }
}

materialContextMixin(MixinsContextProvider.prototype);
applicationContextMixin(MixinsContextProvider.prototype);

abstract class PointsPathFormDataProvider<N extends string> extends MixinsContextProvider {
    abstract name: N;

    readonly domain: Domain = "important";

    private reciprocalLattice: ReciprocalLattice;

    readonly useExplicitPath: boolean;

    readonly is2PIBA: boolean = false;

    constructor(config: ContextItem<Data>, externalContext: ExternalContext) {
        super(config, externalContext);
        this.reciprocalLattice = new Made.ReciprocalLattice(this.material.lattice);
        this.useExplicitPath = this.application.name === "vasp";
    }

    getDefaultData() {
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

    get jsonSchema() {
        return JSONSchemasInterface.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.point": {
                default: defaultPoint,
                enum: this.reciprocalLattice.symmetryPoints.map((x) => x.point),
            },
            "items.properties.steps": {
                default: defaultSteps,
            },
        });
    }

    setData(path: Data) {
        const rawData: DataItem[] = path.map((pathItem) => {
            const point = this.reciprocalLattice.symmetryPoints.find((sp) => {
                return sp.point === pathItem.point;
            });
            if (!point) {
                throw new Error(`Point ${pathItem.point} not found in reciprocal lattice`);
            }
            return { ...pathItem, coordinates: point.coordinates };
        });

        const processedData = this.useExplicitPath ? this.convertToExplicitPath(rawData) : rawData;

        const newData = processedData.map((p) => {
            const coordinates = this.is2PIBA
                ? this.reciprocalLattice.getCartesianCoordinates(p.coordinates)
                : p.coordinates;

            return {
                ...p,
                coordinates: coordinates.map((c) => +s.sprintf("%14.9f", c)),
            };
        }) as Data;

        super.setData(newData);
    }

    // Initially, path contains symmetry points with steps counts.
    // This function explicitly calculates each point between symmetry points by step counts.
    // eslint-disable-next-line class-methods-use-this
    private convertToExplicitPath(path: DataItem[]): DataItem[] {
        return path.reduce<DataItem[]>((acc, startPoint, index) => {
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

            // TODO-QUESTION: confirm that "point" property should be present after transformation; point was missing in original implementation
            acc.push(
                {
                    steps,
                    coordinates: startPoint.coordinates,
                    point: startPoint.point,
                },
                ...middlePoints.map((coordinates) => ({
                    steps,
                    coordinates,
                    // TODO-QUESTION: is this correct?
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
