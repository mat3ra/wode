import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type {
    HubbardJContextItemSchema,
    HubbardLegacyContextItemSchema,
    HubbardUContextItemSchema,
    HubbardVContextItemSchema,
} from "@mat3ra/esse/dist/js/types";

import materialContextMixin, {
    type MaterialContextMixin,
    type MaterialExternalContext,
} from "../../mixins/MaterialContextMixin";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";

type Schema =
    | HubbardJContextItemSchema
    | HubbardUContextItemSchema
    | HubbardVContextItemSchema
    | HubbardLegacyContextItemSchema;

export type HubbardExternalContext = JinjaExternalContext & MaterialExternalContext;

type Base = typeof JSONSchemaDataProvider<Schema, HubbardExternalContext> &
    Constructor<MaterialContextMixin>;

abstract class HubbardContextProvider<
    S extends Schema,
    EC extends HubbardExternalContext = HubbardExternalContext,
> extends (JSONSchemaDataProvider as Base) {
    abstract readonly name: S["name"];

    abstract getDefaultData(): S["data"];

    readonly domain = "important" as const;

    readonly entityName = "unit" as const;

    protected readonly uniqueElementsWithLabels: string[];

    protected readonly firstElement: string;

    protected readonly secondSpecies: string;

    protected readonly orbitalList = [
        "2p",
        "3s",
        "3p",
        "3d",
        "4s",
        "4p",
        "4d",
        "4f",
        "5s",
        "5p",
        "5d",
        "5f",
        "6s",
        "6p",
        "6d",
        "7s",
        "7p",
        "7d",
    ];

    constructor(contextItem: Partial<S>, externalContext: EC) {
        super(contextItem, externalContext);
        this.initMaterialContextMixin(externalContext);

        this.uniqueElementsWithLabels = [
            ...new Set(this.material.Basis?.elementsWithLabelsArray || []),
        ];

        this.firstElement =
            this.uniqueElementsWithLabels?.length > 0 ? this.uniqueElementsWithLabels[0] : "";

        this.secondSpecies =
            this.uniqueElementsWithLabels?.length > 1
                ? this.uniqueElementsWithLabels[1]
                : this.firstElement;
    }
}

materialContextMixin(HubbardContextProvider.prototype);

export default HubbardContextProvider;
