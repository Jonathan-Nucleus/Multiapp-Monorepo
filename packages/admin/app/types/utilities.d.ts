type ObjectKeys<T> = T extends Record<string, unknown>
  ? (keyof T)[]
  : T extends object
  ? (keyof T)[]
  : string[];

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
