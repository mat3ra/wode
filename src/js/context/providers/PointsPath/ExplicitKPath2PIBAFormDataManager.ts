import type { PathContextItemSchema } from "@mat3ra/esse/dist/js/types";

import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, {
    type PointsPathFormDataProviderExternalContext,
} from "./PointsPathFormDataProvider";

type Name = "explicitKPath2PIBA";
type Schema = PathContextItemSchema;

export default class ExplicitKPath2PIBAFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name = "explicitKPath2PIBA" as const;

    readonly is2PIBA = true;

    readonly useExplicitPath = true;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PointsPathFormDataProviderExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "explicitKPath2PIBA");

        return new ExplicitKPath2PIBAFormDataManager(contextItem, externalContext);
    }
}
