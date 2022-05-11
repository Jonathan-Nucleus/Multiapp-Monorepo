import type { DocumentNode, GraphQLError, GraphQLFieldResolver } from "graphql";
import { MongoError } from "mongodb";
import { AuthenticationError, ApolloError } from "apollo-server-errors";
import type { IResolvers } from "@graphql-tools/utils";

import type { IgniteDb } from "../db";
import type { User } from "../schemas/user";
import { InternalServerError } from "./validate";

export type PartialSchema = {
  schema: DocumentNode;
  resolvers: IResolvers;
};

export interface ApolloServerContext {
  db: IgniteDb;
  user?: User.Mongo;
}

export type ApolloServerResolverParams<
  Parent,
  Args = Record<string, unknown>
> = Parameters<GraphQLFieldResolver<Parent, ApolloServerContext, Args>>;

export type NoArgs = unknown;

type SecureResolver<
  Args = Record<string, unknown>,
  Parent = unknown,
  ReturnValue = void
> = (...params: ApolloServerResolverParams<Parent, Args>) => ReturnValue | null;

type ResolverWithUser<
  Args = Record<string, unknown>,
  Parent = unknown,
  ReturnValue = void
> = (
  ...params: Parameters<
    GraphQLFieldResolver<Parent, Required<ApolloServerContext>, Args>
  >
) => ReturnValue;

/**
 * Secures a graphql endpoint by ensuring that a user object is provided as
 * part of the graphql context parameter. If no user object is provided, this
 * returns `null`, and the corresponding schema definition for this resolver
 * should reflect this.
 *
 * @param resolver  The graphql resolver to secure.
 *
 * @returns A secured resolver function that returns null if a valid user object
 *          is not present or calls the resolver provided as a parameter to this
 *          function.
 */
export function secureEndpoint<
  Args = unknown,
  Parent = unknown,
  ReturnValue = void
>(
  resolver: ResolverWithUser<Args, Parent, ReturnValue>
): SecureResolver<Args, Parent, ReturnValue> {
  const secureResolver: SecureResolver<Args, Parent, ReturnValue> = (
    parent,
    args,
    context,
    info
  ): ReturnValue | null => {
    const { user } = context;
    if (!user) {
      throw new AuthenticationError("User is unauthenticated.");
    }

    return resolver(parent, args, { ...context, user }, info);
  };

  return secureResolver;
}

export const formatError = (
  error: GraphQLError
): ApolloError | GraphQLError => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  // Format mongodb errors
  if (
    error instanceof MongoError ||
    error.originalError instanceof MongoError
  ) {
    return new InternalServerError(error.message);
  }

  return error;
};
