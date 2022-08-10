import "./lib/dd-tracer";
import { initializeFirebase } from "./lib/firebase-helper";
import { createApolloServer } from "./lib/apollo/server";

initializeFirebase();

const apolloServer = createApolloServer();

apolloServer.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
