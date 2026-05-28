import type { PathContextItemSchema } from "@mat3ra/esse/dist/js/types";

import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, {
    type PointsPathFormDataProviderExternalContext,
} from "./PointsPathFormDataProvider";

type Name = "explicitKPath";
type Schema = PathContextItemSchema;

export default class ExplicitKPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name = "explicitKPath" as const;

    readonly useExplicitPath = true;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PointsPathFormDataProviderExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "explicitKPath");

        return new ExplicitKPathFormDataManager(contextItem, externalContext);
    }
}
