import type { GridContextItemSchema } from "@mat3ra/esse/dist/js/types";
import type { JSONSchema7 } from "json-schema";

import ConvergenceParameter from "../../../convergence/ConvergenceParameter";
import type { UnitContext } from "../base/ContextProvider";
import PointsGridFormDataProvider, { type ExternalContext } from "./PointsGridFormDataProvider";

type Name = "kgrid";
type Schema = GridContextItemSchema;

export default class KGridFormDataManager extends PointsGridFormDataProvider<Name> {
    readonly name = "kgrid" as const;

    readonly jsonSchema: JSONSchema7;

    constructor(contextItem: Partial<Schema>, externalContext: ExternalContext) {
        super(contextItem, externalContext, 1);

        this.jsonSchema = this.buildFormJsonSchema();
    }

    static createFromUnitContext(unitContext: UnitContext, externalContext: ExternalContext) {
        const contextItem = this.findContextItem<Schema>(unitContext, "kgrid");

        return new KGridFormDataManager(contextItem, externalContext);
    }

    applyConvergenceParameter(parameter: ConvergenceParameter) {
        this.setData({
            ...this.getData(),
            ...parameter.unitContext.data,
        });

        this.setIsEdited(true);
    }
}
