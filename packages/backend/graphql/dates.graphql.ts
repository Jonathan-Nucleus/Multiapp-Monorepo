import { gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { PartialSchema } from "../lib/apollo/apollo-helper";

const schema = gql`
  scalar Date
`;

const resolvers = {
  Date: new GraphQLScalarType<Date, string>({
    name: "Date",
    parseValue(value): Date {
      return new Date(value as string);
    },
    serialize(value): string {
      return (value as Date).toISOString();
    },
  }),
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;
