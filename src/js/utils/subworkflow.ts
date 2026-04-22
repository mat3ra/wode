import type { SubworkflowSchema } from "@mat3ra/esse/dist/js/types";
import { ModelFactory } from "@mat3ra/mode";
import { Utils } from "@mat3ra/utils";

import { calculateHash as calculateUnitHash } from "./units";

function calculateModelHash(config: SubworkflowSchema): string {
    const modelInstance = ModelFactory.create({
        ...config.model,
        application: config.application,
    });
    const { model } = config;

    if (modelInstance.Method.omitInHashCalculation) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: _data, ...method } = model.method;
        return Utils.hash.calculateHashFromObject({
            ...model,
            method,
        });
    }

    return Utils.hash.calculateHashFromObject(model);
}

export function calculateHash(config: SubworkflowSchema) {
    return Utils.hash.calculateHashFromObject({
        application: config.application,
        model: calculateModelHash(config),
        units: config.units.map(calculateUnitHash).join(),
    });
}
