import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    name: String
  }

  type Query {
    users: [User]
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      users: () => {
        console.log("Queried users");
        return [];
      },
    },
  },
});
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
