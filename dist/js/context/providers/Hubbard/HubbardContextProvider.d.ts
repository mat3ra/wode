import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import type { ContextItem, Domain } from "../base/ContextProvider";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";
type HubbardName = "hubbard_u" | "hubbard_j" | "hubbard_v" | "hubbard_legacy";
export type HubbardExternalContext = JinjaExternalContext & MaterialExternalContext;
type Base = typeof JSONSchemaDataProvider<HubbardName, object, object, HubbardExternalContext> & Constructor<MaterialContextMixin>;
declare const HubbardContextProvider_base: Base;
export default abstract class HubbardContextProvider<N extends HubbardName, D extends object, EC extends HubbardExternalContext = HubbardExternalContext> extends HubbardContextProvider_base {
    abstract readonly name: N;
    abstract getDefaultData(): D;
    readonly domain: Domain;
    protected readonly uniqueElementsWithLabels: string[];
    protected readonly firstElement: string;
    protected readonly secondSpecies: string;
    protected readonly orbitalList: string[];
    constructor(contextItem: ContextItem<D>, externalContext: EC);
}
export {};
