import { ObjectId } from "mongodb";

export type MongoId = ObjectId | string;

// Utility function that guarantees an id as a mongo ObjectId
export const toObjectId = (id: MongoId): ObjectId =>
  id instanceof ObjectId ? id : new ObjectId(id);

export const toObjectIds = (ids: MongoId[]): ObjectId[] => {
  if (!ids) return [];
  return ids.map((id) => (id instanceof ObjectId ? id : new ObjectId(id)));
};

export type ValueOf<T> = T[keyof T];

// Utility type that recursively converts a mongo entity to a graphql entity
// by replacing all instances of ObjectId with a string type. The second
// template variable is used to avoid deconstructing any user-specified types.
// For instance, passing the type Date would avoid recursively checking all
// properties of the Date type for instances of ObjectId, which ensure the
// property is still recognized as a Date type.
export type GraphQLEntity<T, E = never> = T extends ObjectId
  ? Exclude<T, ObjectId> | string
  : T extends (infer A)[]
  ? GraphQLEntity<A, E>[]
  : T extends E // Avoid deconstructing user specified types
  ? T
  : T extends {} // This needs to be {} rather than Record<string, unknown>
  ? { [K in keyof T]: GraphQLEntity<T[K], E> }
  : T;

// Similar to GraphQLEntity except that it makes all ObjectId properties
// ObjectId or string. This may be useful when accepting input types from
// GraphQL
export type DualEntity<T, E = never> = T extends ObjectId
  ? T | string
  : T extends (infer A)[]
  ? DualEntity<A, E>[]
  : T extends E // Avoid deconstructing user specified types
  ? T
  : T extends {}
  ? { [K in keyof T]: DualEntity<T[K], E> }
  : T;
