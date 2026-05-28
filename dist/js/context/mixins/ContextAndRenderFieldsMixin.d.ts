import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
export type Context = AnyObject;
export type ContextMixin = {
    context: Context;
    renderingContext: Context;
    getRenderingContext(): Context;
    updateRenderingContext(ctx: Context): void;
    getPersistentContext(): Context;
    updatePersistentContext(ctx: Context): void;
    getCombinedContext(): Context;
};
type AbstractBase = {
    render(ctx: Context): void;
};
export declare function contextMixin<T extends InMemoryEntity & AbstractBase>(item: T): asserts item is T & ContextMixin;
export {};
