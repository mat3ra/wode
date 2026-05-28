"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("@mat3ra/code/dist/js/math");
const JSONSchemasInterface_1 = __importDefault(require("@mat3ra/esse/dist/js/esse/JSONSchemasInterface"));
const made_1 = require("@mat3ra/made");
const ApplicationContextMixin_1 = __importDefault(require("../../mixins/ApplicationContextMixin"));
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
(0, ApplicationContextMixin_1.default)(MixinsContextProvider.prototype);
class PointsPathFormDataProvider extends MixinsContextProvider {
    constructor(config, externalContext) {
        super(config, externalContext);
        this.domain = "important";
        this.entityName = "unit";
        this.is2PIBA = false;
        this.uiSchemaStyled = {
            items: {
                point: {},
                steps: {},
            },
        };
        this.reciprocalLattice = new made_1.Made.ReciprocalLattice(this.material.lattice);
        this.useExplicitPath = this.application.name === "vasp";
    }
    getDefaultData() {
        return this.reciprocalLattice.defaultKpointPath;
    }
    updateMaterialHash() {
        var _a;
        const previousMaterialHash = (_a = this.extraData) === null || _a === void 0 ? void 0 : _a.materialHash;
        super.updateMaterialHash();
        // Reset path only when the material actually changed (hash). Do not clear `isEdited` just
        // because the material has no id (common default material in designers): that ran every
        // render, wiped isEdited, and savePersistentContext dropped k-path/Q-path from `unit.context`.
        if (previousMaterialHash && previousMaterialHash !== this.material.hash) {
            this.isEdited = false;
        }
    }
    get jsonSchema() {
        const jsonSchema = JSONSchemasInterface_1.default.getPatchedSchemaById(jsonSchemaId, {
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
    patchForRendering(data) {
        return this.addCoordinates(data);
    }
    addCoordinates(path) {
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
        const mapped = processedData.map((p) => {
            const coordinates = this.is2PIBA
                ? this.reciprocalLattice.getCartesianCoordinates(p.coordinates)
                : p.coordinates;
            return {
                ...p,
                coordinates: coordinates.map((c) => Number(c.toFixed(9))),
            };
        });
        return mapped;
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
            acc.push({
                steps,
                coordinates: startPoint.coordinates,
                point: startPoint.point,
            }, ...middlePoints.map((coordinates) => ({
                steps,
                coordinates,
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
