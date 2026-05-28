"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicSubworkflowsByApp = exports.getSurfaceEnergySubworkflowUnits = void 0;
const getQpointIrrep_1 = require("./espresso/getQpointIrrep");
const surfaceEnergy_1 = require("./surfaceEnergy");
Object.defineProperty(exports, "getSurfaceEnergySubworkflowUnits", { enumerable: true, get: function () { return surfaceEnergy_1.getSurfaceEnergySubworkflowUnits; } });
const dynamicSubworkflowsByApp = {
    espresso: { getQpointIrrep: getQpointIrrep_1.getQpointIrrep },
};
exports.dynamicSubworkflowsByApp = dynamicSubworkflowsByApp;
