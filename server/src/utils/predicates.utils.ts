/// <reference path="./base.d.ts" />

// Overloads for readability
export function has<T, K1 extends keyof any>(
    o: T | object | null | undefined,
    prop: K1
): o is Has<T, K1>;

export function has<T, K1 extends keyof any, K2 extends keyof any>(
    o: T | object | null | undefined,
    prop: K1,
    prop2?: K2
): o is Has<T, K1 | K2>;

export function has<T, K1 extends keyof any, K2 extends keyof any, K3 extends keyof any>(
    o: T | object | null | undefined,
    prop: K1,
    prop2?: K2,
    prop3?: K3
): o is Has<T, K1 | K2 | K3>;

export function has<
    T,
    K1 extends keyof any,
    K2 extends keyof any,
    K3 extends keyof any,
    K4 extends keyof any
>(
    o: T | object | null | undefined,
    prop: K1,
    prop2?: K2,
    prop3?: K3,
    prop4?: K4
): o is Has<T, K1 | K2 | K3 | K4>;

export function has<T, K extends keyof any>(
    o: T | object | null | undefined,
    prop: K,
    prop2?: K,
    prop3?: K,
    prop4?: K
): o is Has<T, K> {
    return (
        o != null &&
        (o as any)[prop] != null &&
        (prop2 === undefined || (o as any)[prop2] != null) &&
        (prop3 === undefined || (o as any)[prop3] != null) &&
        (prop4 === undefined || (o as any)[prop4] != null)
    );
}

export function notNil<A>(a: A): a is NonNullable<A> {
    return a != null;
}

export function tapMaybe<A, B>(
    ab: (a: NonNullable<A>) => B,
    a: A
): B | ([A] extends [null | undefined] ? A : never) {
    return a != null ? ab(a as NonNullable<A>) : (a as any);
}

export function mapMaybe<A, B>(
    f: (_: A) => B | null | undefined,
    as: readonly A[] | null | undefined
): B[] {
    return as?.map((a) => f(a)).filter(notNil) ?? [];
}

export function catMaybes<T>(
    xs: readonly (T | null | undefined)[] | null | undefined
): NonNullable<T>[] {
    return xs?.filter(notNil) ?? [];
}

export function throwAs<T extends Error>(
    E: new (msg?: string) => T,
    messagePrefix?: string,
    from?: Function
): (error: unknown) => never {
    return (error) => {
        const message = [messagePrefix, has(error, "message") ? error.message : null]
            .filter(Boolean)
            .join(": ");
        const e = new E(message);
        if (error instanceof Error) e.cause = error;
        Error.captureStackTrace(e, from ?? throwAs);
        throw e;
    };
}

export function throwNil(
    E: new (msg?: string) => Error,
    messagePrefix?: string
): <T>(v: T | null | undefined) => NonNullable<T> {
    return (v) => {
        if (v != null) return v as any;
        return throwAs(E, messagePrefix)(undefined);
    };
}

export function parseNonEmptyString(v: unknown): string | undefined {
    switch (typeof v) {
        case "string":
            return v ? v : undefined;
        default:
            return undefined;
    }
}

export function parseMaybeInt(v: unknown): number | undefined {
    switch (typeof v) {
        case "number":
            return v;
        case "bigint":
            return Number(v);
        case "string":
            const n = parseInt(v);
            return Number.isFinite(n) ? n : undefined;
        default:
            return undefined;
    }
}
