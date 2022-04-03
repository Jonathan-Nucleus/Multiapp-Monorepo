type ObjectKeys<T> = T extends Record<string, unknown> ? (keyof T)[] : string[];
interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
