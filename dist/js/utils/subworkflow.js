"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHash = calculateHash;
const mode_1 = require("@mat3ra/mode");
const utils_1 = require("@mat3ra/utils");
const units_1 = require("./units");
function calculateModelHash(config) {
    const modelInstance = mode_1.ModelFactory.create({
        ...config.model,
        application: config.application,
    });
    const { model } = config;
    if (modelInstance.Method.omitInHashCalculation) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: _data, ...method } = model.method;
        return utils_1.Utils.hash.calculateHashFromObject({
            ...model,
            method,
        });
    }
    return utils_1.Utils.hash.calculateHashFromObject(model);
}
function calculateHash(config) {
    return utils_1.Utils.hash.calculateHashFromObject({
        application: config.application,
        model: calculateModelHash(config),
        units: config.units.map(units_1.calculateHash).join(),
    });
}
