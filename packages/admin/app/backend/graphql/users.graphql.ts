import { gql } from "apollo-server-core";
import { PartialSchema } from "../apollo/apollo-helper";
import { User, UserSchema } from "../schemas/user";
import AppUserSchema from "backend/graphql/users.graphql";

export * from "backend/graphql/users.graphql";

const schema = gql`
  ${UserSchema}
`;

type GraphQLUser = User.GraphQL;
type UpdateUserInput = User.GraphQLUpdate;

export type { GraphQLUser, UpdateUserInput };

const partialSchema: PartialSchema = {
  schema,
  resolvers: AppUserSchema.resolvers,
};
export default partialSchema;
