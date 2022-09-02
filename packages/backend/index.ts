import "./lib/dd-tracer";

import express from "express";
import { createServer } from "http";

import { initializeFirebase } from "./lib/firebase-helper";
import { createApolloServer } from "./lib/apollo/server";
import { initializeRestApi } from "./rest";

initializeFirebase();

const app = express();
const httpServer = createServer(app);
const apolloServer = createApolloServer(httpServer);

initializeRestApi(app);

const startServer = async (): Promise<void> => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/" });

  const port = process.env.PORT ?? 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
};

startServer();
