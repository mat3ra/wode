/**
 * Narrows `T | null | undefined` to `T`. Use in tests instead of `!` or manual `if (!x) throw`.
 */
export function assertNotNull<T>(value: T | null | undefined): T {
    if (value == null) {
        throw new Error("Expected value to be non-null");
    }
    return value;
}
