type ObjectKeys<T> = T extends object ? (keyof T)[] : string[];
interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
