type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;

type Falsy = false | 0 | "" | null | undefined;
type Truthy<T> = T extends Falsy ? never : T;

type NonUndefined<A> = Exclude<A, undefined>;
type NonNull = Exclude<Builtin, null | undefined> | unknown[] | SomeRecord;
type NonEmptyObject<T extends {}> = keyof T extends never ? never : T;

interface NonEmptyArray<A> extends Array<A> {
    length: Exclude<number, 0>;
    0: A;
}

type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type Builtin = Primitive | Function | Date | Error | RegExp;
type Tuple<T> = T extends any[] ? (any[] extends T ? never : T) : never;

type Has<T, K extends keyof any> = IsUnknown<T> extends true
    ? { [k in K]: NonNull }
    : T extends any
    ? T extends object
        ? [K] extends [keyof T] // Pick only members with all K keys
            ? T & { [k in K]: T[k] & {} }
            : never
        : K extends keyof T
        ? T
        : never
    : never;
