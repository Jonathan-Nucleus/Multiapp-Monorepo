import { gql } from "apollo-server-core";
import * as yup from "yup";

import { PartialSchema, secureEndpoint } from "../apollo/apollo-helper";
import { isObjectId, validateArgs } from "../apollo/validate";
import { User } from "../schemas/user";

const schema = gql`
  type Query {
    user(userId: ID!): User
    users(after: ID, limit: Int): [User!]!
    searchUsers(search: String): [User!]!
  }
`;

const resolvers = {
  Query: {
    user: secureEndpoint(
      async (
        parentIgnored,
        args: { userId: string },
        { db }
      ): Promise<User.Mongo | User.Stub | null> => {
        const validator = yup.object({
          after: yup.string().test({
            test: isObjectId,
            message: "Invalid user id",
          }),
          limit: yup.number(),
        });

        validateArgs(validator, args);

        const { userId } = args;
        return db.users.find({ _id: userId });
      }
    ),
    users: secureEndpoint(
      async (
        parentIgnored,
        args: { after?: string; limit?: number },
        { db }
      ): Promise<User.Mongo[]> => {
        const validator = yup.object({
          after: yup.string().test({
            test: isObjectId,
            message: "Invalid user id",
          }),
          limit: yup.number(),
        });

        validateArgs(validator, args);

        return db.users.findAll();
      }
    ),
    searchUsers: secureEndpoint(
      async (
        parentIgnored,
        args: { search?: string },
        { db }
      ): Promise<User.Mongo[]> => {
        const validator = yup
          .object()
          .shape({
            search: yup.string(),
          })
          .required();

        validateArgs(validator, args);

        const { search } = args;
        return db.users.findByKeyword(search);
      }
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
