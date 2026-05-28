import type { PathContextItemSchema } from "@mat3ra/esse/dist/js/types";

import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, {
    type PointsPathFormDataProviderExternalContext,
} from "./PointsPathFormDataProvider";

type Name = "qpath";
type Schema = PathContextItemSchema;

export default class QPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name = "qpath" as const;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PointsPathFormDataProviderExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "qpath");

        return new QPathFormDataManager(contextItem, externalContext);
    }
}
