"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("@mat3ra/code/dist/js/math");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const made_1 = require("@mat3ra/made");
const underscore_string_1 = __importDefault(require("underscore.string"));
const ApplicationContextMixin_1 = require("../../mixins/ApplicationContextMixin");
const MaterialContextMixin_1 = __importDefault(require("../../mixins/MaterialContextMixin"));
const JSONSchemaDataProvider_1 = __importDefault(require("../base/JSONSchemaDataProvider"));
const defaultPoint = "Г";
const defaultSteps = 10;
const jsonSchemaId = "context-providers-directory/points-path-data-provider";
class MixinsContextProvider extends JSONSchemaDataProvider_1.default {
    constructor(contextItem, externalContext) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);
        this.initApplicationContextMixin(externalContext);
    }
}
(0, MaterialContextMixin_1.default)(MixinsContextProvider.prototype);
(0, ApplicationContextMixin_1.applicationContextMixin)(MixinsContextProvider.prototype);
class PointsPathFormDataProvider extends MixinsContextProvider {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.domain = "important";
        this.is2PIBA = false;
        this.reciprocalLattice = new made_1.Made.ReciprocalLattice(this.material.lattice);
        this.useExplicitPath = this.application.name === "vasp";
    }
    getDefaultData() {
        return this.reciprocalLattice.defaultKpointPath;
    }
    updateMaterialHash() {
        var _a;
        super.updateMaterialHash();
        // Workaround: Material.createDefault() used to initiate workflow reducer and hence here too
        //  does not have an id. Here we catch when such material is used and avoid resetting isEdited
        const isMaterialCreatedDefault = !this.material.id;
        const isMaterialUpdated = ((_a = this.extraData) === null || _a === void 0 ? void 0 : _a.materialHash) !== this.material.hash;
        if (isMaterialUpdated || isMaterialCreatedDefault) {
            this.isEdited = false;
        }
    }
    get jsonSchema() {
        return JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
            "items.properties.point": {
                default: defaultPoint,
                enum: this.reciprocalLattice.symmetryPoints.map((x) => x.point),
            },
            "items.properties.steps": {
                default: defaultSteps,
            },
        });
    }
    setData(path) {
        const rawData = path.map((pathItem) => {
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
                coordinates: coordinates.map((c) => +underscore_string_1.default.sprintf("%14.9f", c)),
            };
        });
        super.setData(newData);
    }
    // Initially, path contains symmetry points with steps counts.
    // This function explicitly calculates each point between symmetry points by step counts.
    // eslint-disable-next-line class-methods-use-this
    convertToExplicitPath(path) {
        return path.reduce((acc, startPoint, index) => {
            const nextPoint = path[index + 1];
            if (!nextPoint) {
                return acc;
            }
            const middlePoints = math_1.math.calculateSegmentsBetweenPoints3D(startPoint.coordinates, nextPoint.coordinates, startPoint.steps);
            const steps = 1;
            // TODO-QUESTION: confirm that "point" property should be present after transformation; point was missing in original implementation
            acc.push({
                steps,
                coordinates: startPoint.coordinates,
                point: startPoint.point,
            }, ...middlePoints.map((coordinates) => ({
                steps,
                coordinates,
                // TODO-QUESTION: is this correct?
                point: startPoint.point,
            })));
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
exports.default = PointsPathFormDataProvider;
