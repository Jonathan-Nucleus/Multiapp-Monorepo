import { createApolloServer } from "admin/app/backend/apollo/server";
import { NextApiHandler } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = createApolloServer();
const startServer = apolloServer.start();
const handler: NextApiHandler = async (req, res) => {
  await startServer;
  return apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export default handler;
