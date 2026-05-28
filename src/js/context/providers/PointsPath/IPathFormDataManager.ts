import type { PathContextItemSchema } from "@mat3ra/esse/dist/js/types";

import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, {
    type PointsPathFormDataProviderExternalContext,
} from "./PointsPathFormDataProvider";

type Name = "ipath";
type Schema = PathContextItemSchema;

export default class IPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name = "ipath" as const;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PointsPathFormDataProviderExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "ipath");

        return new IPathFormDataManager(contextItem, externalContext);
    }
}
