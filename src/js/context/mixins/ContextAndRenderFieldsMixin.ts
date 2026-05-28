import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";

export type Context = AnyObject;

export type ContextMixin = {
    context: Context; // persistent context
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

export function contextMixin<T extends InMemoryEntity & AbstractBase>(
    item: T,
): asserts item is T & ContextMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & ContextMixin = {
        get context() {
            return this.requiredProp<Context>("context");
        },
        set context(ctx: Context) {
            this.setProp("context", ctx);
        },
        renderingContext: {},
        updateRenderingContext(ctx: Context) {
            this.context = { ...this.renderingContext, ...ctx };
        },
        getRenderingContext() {
            return this.renderingContext;
        },
        getPersistentContext() {
            return this.context;
        },
        updatePersistentContext(ctx: Context) {
            this.context = { ...ctx };
        },
        getCombinedContext() {
            return {
                ...this.getPersistentContext(),
                ...this.getRenderingContext(),
            };
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
