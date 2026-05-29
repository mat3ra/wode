import type { PathContextItemSchema } from "@mat3ra/esse/dist/js/types";

import type { UnitContext } from "../base/ContextProvider";
import PointsPathFormDataProvider, {
    type PointsPathFormDataProviderExternalContext,
} from "./PointsPathFormDataProvider";

type Name = "kpath";
type Schema = PathContextItemSchema;

export default class KPathFormDataManager extends PointsPathFormDataProvider<Name> {
    readonly name = "kpath" as const;

    static createFromUnitContext(
        unitContext: UnitContext,
        externalContext: PointsPathFormDataProviderExternalContext,
    ) {
        const contextItem = this.findContextItem<Schema>(unitContext, "kpath");

        return new KPathFormDataManager(contextItem, externalContext);
    }
}
