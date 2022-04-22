import { createApolloServer } from "./lib/server";

const apolloServer = createApolloServer();

apolloServer.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
