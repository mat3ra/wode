import type { HubbardJContextItemSchema, HubbardLegacyContextItemSchema, HubbardUContextItemSchema, HubbardVContextItemSchema } from "@mat3ra/esse/dist/js/types";
import { type MaterialContextMixin, type MaterialExternalContext } from "../../mixins/MaterialContextMixin";
import JSONSchemaDataProvider, { type JinjaExternalContext } from "../base/JSONSchemaDataProvider";
type Schema = HubbardJContextItemSchema | HubbardUContextItemSchema | HubbardVContextItemSchema | HubbardLegacyContextItemSchema;
export type HubbardExternalContext = JinjaExternalContext & MaterialExternalContext;
interface MixinsHubbardContextProvider extends MaterialContextMixin, MaterialExternalContext {
}
declare abstract class MixinsHubbardContextProvider extends JSONSchemaDataProvider<Schema, HubbardExternalContext> {
    constructor(contextItem: Partial<Schema>, externalContext: HubbardExternalContext);
}
declare abstract class HubbardContextProvider<S extends Schema, EC extends HubbardExternalContext = HubbardExternalContext> extends MixinsHubbardContextProvider {
    abstract readonly name: S["name"];
    abstract getDefaultData(): S["data"];
    readonly domain: "important";
    readonly entityName: "unit";
    protected readonly uniqueElementsWithLabels: string[];
    protected readonly firstElement: string;
    protected readonly secondSpecies: string;
    protected readonly orbitalList: string[];
    constructor(contextItem: Partial<S>, externalContext: EC);
}
export default HubbardContextProvider;
